import { Post } from './app/shared/models/Post';
import { Topic } from './app/shared/models/Topic';

export const sample_posts: Post[] = [
  {
    id: '1',
    owner: 'Daniel',
    topic: 'Fashion',
    createdAt: '1',
    title: 'Lowkey I could win the triple crown if I tried.',
    imageUrl:
      'assets/low-key-i-could-win-the-triple-crown-if-i-tried-v0-0jou6vensz1d1.jpg',
    votes: 26,
    comments: [
      { author: 'Daniel', text: 'Cool!', createdAt: '3' },
      {
        author: 'Ivan',
        text: 'Can u let me know what inseam you chose for the jeans and how tall u are for reference? Kinda wanna cop the darker ones.',
        createdAt: '1',
      },
    ],
  },
  {
    id: '2',
    owner: 'Daniel',
    topic: 'Gaming',
    createdAt: '3',
    title: 'What is your favourite game?',
    description:
      "Hey guys, what's your favorite game of all time? I'm currently stuck on a decision between The Last of Us and Overwatch. Has anyone else played either of those? And what do you think makes them so great?",
    votes: 119,
    comments: [],
  },
  {
    id: '3',
    owner: 'Ivan',
    topic: 'Food',
    createdAt: '3',
    title: 'What is your favourite food?',
    description:
      "Hey guys, what's your favorite food of all time? I'm currently stuck on a decision between Spaghetti and Meatballs. Has anyone else played either of those? And what do you think makes them so great?",
    votes: 119,
    comments: [
      {
        author: 'Michael',
        text: "Fried Chicken I know it's greasy and unhealthy, but I freakin' love it. Just had Wendy's fried chicken today and damn damn damn!",
        createdAt: '2',
      },
    ],
  },
];

export const sample_topics: Topic[] = [
  {
    id: '1',
    topicName: 'Fashion',
    banner:
      'https://styles.redditmedia.com/t5_2qhoq/styles/bannerBackgroundImage_lxwobe69dtyc1.png',
    postsAmount: 127,
  },
  {
    id: '2',
    topicName: 'Gaming',
    banner:
      'https://styles.redditmedia.com/t5_2qh03/styles/bannerBackgroundImage_j84aqdq3eyd91.png',
    postsAmount: 150,
  },
  {
    id: '3',
    topicName: 'Comedy',
    banner:
      'https://styles.redditmedia.com/t5_2qhkm/styles/bannerBackgroundImage_cwxhz50a7kjb1.jpg?format=pjpg&s=74991b66da2086ff79bc4a01aeb42aeb1d7ca89e',
    postsAmount: 112,
  },
  {
    id: '4',
    topicName: 'Music',
    banner:
      'https://styles.redditmedia.com/t5_2qh1u/styles/bannerBackgroundImage_5tzfnity8g9c1.jpg?format=pjpg&s=94c7303e22c42d6aa419c2cbb3898b9d3116a9b7',
    postsAmount: 15,
  },
  {
    id: '5',
    topicName: 'Art',
    banner:
      'https://styles.redditmedia.com/t5_2qh7a/styles/bannerBackgroundImage_e7mkyzrk9t811.jpg?format=pjpg&s=1c0fa3c4f43f16accc2497210c236dc6c2d37993',
    postsAmount: 19,
  },
  {
    id: '6',
    topicName: 'Cinema',
    banner:
      'https://styles.redditmedia.com/t5_2qh3s/styles/bannerBackgroundImage_k1ukyjei82r81.png',
    postsAmount: 96,
  },
  {
    id: '7',
    topicName: 'Food',
    banner:
      'https://styles.redditmedia.com/t5_2qh55/styles/bannerBackgroundImage_mkxku8m12of51.png',
    postsAmount: 279,
  },
  {
    id: '8',
    topicName: 'News',
    banner:
      'https://styles.redditmedia.com/t5_2cneq/styles/bannerBackgroundImage_4vvj1k5ldn671.png',
    postsAmount: 115,
  },
  {
    id: '9',
    topicName: 'Technology',
    banner:
      'https://styles.redditmedia.com/t5_2qi4j/styles/bannerBackgroundImage_18gsd8vk85k41.jpg?format=pjpg&s=ba745e6a79487cb4c8065282c9fb1b917e39bada',
    postsAmount: 54,
  },
];
