import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { CreateUserDTO } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatedResponseDTO,
  DeletedResponseDTO,
  UpdatedResponseDTO,
  ViewResponseDTO,
} from '../common/dto';
import { KNEX_CONNECTION } from '../knex-connection/knex-connection.provider';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDataDTO } from './dto/get-user.dto';

/**
 * Repository layer for user operations
 */
@Injectable()
export class UsersRepository {
  private readonly _logger: Logger;
  private readonly _tableName: string;

  /**
   *
   * @param conn initialization of knex connection
   */
  constructor(@Inject(KNEX_CONNECTION) private conn: Knex) {
    this._logger = new Logger('UsersRepository');
    this._tableName = 'users';
  }

  /**
   * Method to create user in db and keycloak
   * @param user user creation payload
   * @returns
   */
  async createWithKeycloakId(
    user: CreateUserDTO,
    keycloakId: string,
    conn?: Knex,
  ): Promise<CreatedResponseDTO> {
    conn = conn || this.conn;
    /**
     * checking if user exists with the given email in db
     */
    const userAlreadyExists = await conn
      .where({ email: user.email })
      .from(this._tableName)
      .first('id')
      .catch((error) => {
        this._logger.error(`error: ${error}`);
        throw new InternalServerErrorException('Failed to create user');
      });

    if (userAlreadyExists?.id) {
      throw new ConflictException(
        `User already exists with the given email: ${user.email}`,
      );
    }
    try {
      let resp: CreatedResponseDTO;
      await this.conn.transaction(async (trx) => {
        /**
         * creating user in db
         */
        [resp] = await trx
          .insert({
            id: uuidv4(),
            first_name: user.firstName,
            last_name: user.lastName,
            middle_name: user.middleName || '',
            email: user.email,
            mobile_number: user.mobile?.number,
            mobile_code: user.mobile?.code,
            keycloak_id: keycloakId,
          })
          .into(this._tableName)
          .returning(['id', 'created_at']);
      });
      const { id, created_at } = resp;
      return { id, created_at };
    } catch (error) {
      this._logger.error(
        `Error in createWithKeycloakId method, error: ${error}`,
      );
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Method for getting user by id
   * @param id user id
   * @param columns columns to be returned
   * @param conn conn is knex connection
   * @returns
   */
  async getUserById(
    id: string,
    columns?: string[],
    conn?: Knex,
  ): Promise<ViewResponseDTO<UserDataDTO>> {
    conn = conn || this.conn;
    const user: UserDataDTO = await conn
      .where({ id })
      .first(
        Array.isArray(columns) && columns?.length
          ? [...new Set(['id', ...columns])]
          : '*',
      )
      .from(this._tableName)
      .catch((error) => {
        this._logger.error(`Error in getUserById method, error: ${error}`);
        throw new InternalServerErrorException('Failed to get user');
      });

    if (!user?.id) {
      throw new NotFoundException('User not found');
    }

    return { data: user };
  }

  /**
   * Method for deleting user by id
   * @param id user id
   * @param conn conn is knex connection
   * @returns
   */
  async deleteUser(id: string, conn?: Knex): Promise<DeletedResponseDTO> {
    conn = conn || this.conn;
    const [doc] = await conn(this._tableName)
      .where({ id })
      .del('id')
      .catch((error) => {
        this._logger.error(`Error in deleteUser method, error: ${error}`);
        throw new InternalServerErrorException('Failed to delete user');
      });
    if (!doc?.id) {
      throw new NotFoundException('User not found');
    }
    return { id: doc.id, deleted: true };
  }

  /**
   * Method for updating the user details
   * @param id user to be updated
   * @param updateUserData user details to be updated
   * @param userId user id
   * @param conn conn is knex connection
   * @returns
   */
  async updateUser(
    id: string,
    updateUserData: UpdateUserDTO,
    userId: string,
    conn?: Knex,
  ): Promise<UpdatedResponseDTO> {
    conn = conn || this.conn;
    const { data: userExist } = await this.getUserById(id);
    const _payload = this.setUpdate(updateUserData, userExist);
    if (!Object.keys(_payload).length) {
      throw new BadRequestException('Nothing to update');
    }
    const [doc] = await conn(this._tableName)
      .where({ id })
      .update({ ..._payload, updated_by: userId })
      .returning(['id', 'updated_at'])
      .catch((error) => {
        this._logger.error(`Error in updateUser method, error: ${error}`);
        throw new InternalServerErrorException('Failed to update user');
      });
    if (!doc?.id) {
      throw new NotFoundException('User not found');
    }
    return { id: doc.id, updatedAt: new Date(doc.updated_at) };
  }

  /**
   * Method for setting up proper user update payload
   * @param data
   * @param alreadyExistingUserData
   * @returns
   */
  private setUpdate(data: UpdateUserDTO, alreadyExistingUserData: UserDataDTO) {
    const payload: UpdateUserDTO = {};

    /**
     * user fields that are allowed to update
     */
    const includeKeys = [
      'mobile_number',
      'mobile_code',
      'first_name',
      'last_name',
      'middle_name',
      'is_active',
      'account_verified',
      'keycloakId',
      'welcome_mail_sent',
    ];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        const dataType = typeof element;
        const excludeType = ['function', 'object'];
        if (
          !excludeType.includes(dataType) &&
          includeKeys.includes(key) &&
          element &&
          element !== alreadyExistingUserData[key]
        ) {
          payload[key] = element;
        }
      }
    }
    return payload;
  }

  /**
   * Method for getting user info using keycloak id
   * @param keycloakId keycloak id
   * @param conn knex connection
   * @returns
   */
  async getUserByKeycloakId(
    keycloakId: string,
    conn?: Knex,
  ): Promise<ViewResponseDTO<UserDataDTO>> {
    conn = conn || this.conn;
    const user: UserDataDTO = await conn
      .where({ keycloak_id: keycloakId })
      .first('*')
      .from(this._tableName)
      .catch((error) => {
        this._logger.error(`Error in getUserById method, error: ${error}`);
        throw new InternalServerErrorException('Failed to get user');
      });

    if (!user?.id) {
      throw new NotFoundException('User not found');
    }
    return { data: user };
  }
}
