import { STATIC_USERS } from '../../../test-utils/static.users';
import { toCharacterDto, FullCharacter } from '../character.mapper';
import {
  CharacterStatus,
  MoveType,
  UserRole,
  UserStatus,
} from '@prisma/client';

describe('toCharacterDto', () => {
  const mockCharacter: FullCharacter = {
    id: 'char_123',
    name: 'Groovy Gravy',
    description: 'Soup-slinging menace',
    lore: 'Forged in the stew of destiny.',
    status: CharacterStatus.PROCESSING,
    userId: STATIC_USERS.activeUser1,
    stats: {
      strength: 6,
      agility: 5,
      intelligence: 5,
      charisma: 4,
      constitution: 5,
      luck: 5,
    },
    species: null,
    gender: null,
    alignment: null,
    imageFrontUrl: null,
    imageProfileUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    moves: [
      {
        id: 'move_1',
        name: 'Spoon Slam',
        description: 'Slams foe with a mighty spoon',
        effectValue: 50,
        stat: 'strength',
        type: MoveType.BASIC,
        characterId: 'char_123',
      },
      {
        id: 'move_2',
        name: 'Simmer Storm',
        description: 'Unleashes a boiling tempest',
        effectValue: 80,
        stat: 'intelligence',
        type: MoveType.SPECIAL,
        characterId: 'char_123',
      },
    ],
    user: {
      id: STATIC_USERS.activeUser1,
      name: 'John',
      username: 'Doodle',
      avatarUrl: '',
      bio: '',
      email: 'test@example.com',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  it('should map FullCharacter to CharacterDto correctly', () => {
    const dto = toCharacterDto(mockCharacter);

    expect(dto).toEqual({
      id: 'char_123',
      name: 'Groovy Gravy',
      description: 'Soup-slinging menace',
      lore: 'Forged in the stew of destiny.',
      status: CharacterStatus.PROCESSING,
      userId: STATIC_USERS.activeUser1,
      trainer: 'Doodle', // 👈 comes from user.username
      imageFrontUrl: undefined,
      imageProfileUrl: undefined,
      species: undefined,
      gender: undefined,
      alignment: undefined,
      stats: {
        strength: 6,
        agility: 5,
        intelligence: 5,
        charisma: 4,
        constitution: 5,
        luck: 5,
      },
      moves: [
        {
          name: 'Spoon Slam',
          description: 'Slams foe with a mighty spoon',
          effectValue: 50,
          primaryStat: 'strength',
          type: MoveType.BASIC,
        },
        {
          name: 'Simmer Storm',
          description: 'Unleashes a boiling tempest',
          effectValue: 80,
          primaryStat: 'intelligence',
          type: MoveType.SPECIAL,
        },
      ],
    });
  });
});
