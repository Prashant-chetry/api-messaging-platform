import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
const insertResponse = {
  id: '17943dc1-43ae-4094-a3b0-b999aa0b6bb3',
  createdAt: new Date(),
};

const deleteResponse = {
  id: '17943dc1-43ae-4094-a3b0-b999aa0b6bb3',
  deleted: true,
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive test cases', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should createUsingKeycloakId', () => {
      jest
        .spyOn(CommandBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(insertResponse));

      expect(
        controller.createUsingKeycloakId(insertResponse.id),
      ).resolves.toEqual(insertResponse);
    });

    it('should create', () => {
      jest
        .spyOn(CommandBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(insertResponse));

      expect(
        controller.create({
          firstName: '',
          lastName: '',
          middleName: '',
          mobile: { code: '', number: '' },
          email: '',
        }),
      ).resolves.toEqual(insertResponse);
    });

    it('should delete', () => {
      jest
        .spyOn(CommandBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(deleteResponse));

      expect(controller.delete(deleteResponse.id)).resolves.toEqual(
        deleteResponse,
      );
    });

    it('should getUser', () => {
      jest
        .spyOn(QueryBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve({}));

      expect(controller.getUser(insertResponse.id)).resolves.toEqual({});
    });
  });

  describe('Negative test cases', () => {
    it('should not createUsingKeycloakId', () => {
      jest
        .spyOn(CommandBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(insertResponse));

      expect(controller.createUsingKeycloakId('')).rejects.toThrow(
        'Invalid keycloak id',
      );
    });

    it('should not delete', () => {
      jest
        .spyOn(CommandBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve(deleteResponse));

      expect(controller.delete('')).rejects.toThrow('Invalid user');
    });

    it('should not getUser', () => {
      jest
        .spyOn(QueryBus.prototype, 'execute')
        .mockImplementation(() => Promise.resolve({}));

      expect(controller.getUser('')).rejects.toThrow('Invalid user');
    });
  });
});
