const Group = require('./models/Group');
const Post = require('./models/Post');

const DAY = 24 * 60 * 60 * 1000;

const demoGroups = [
  {
    name: 'CS 101 Study Group',
    description: 'Weekly review for intro CS.',
    activity: [
      { author: 'Alex', text: 'Just finished the recursion homework — definitely tricky.', date: new Date(Date.now() - 2 * DAY) },
      { author: 'Mia', text: 'Anyone want to meet at the library Thursday?', date: new Date(Date.now() - DAY) }
    ]
  },
  {
    name: 'Calculus II Crew',
    description: 'Integrals, series, and survival.',
    activity: [
      { author: 'Jay', text: 'Pro tip: practice u-substitution every day.', date: new Date(Date.now() - 3 * DAY) }
    ]
  },
  {
    name: 'Biology Buddies',
    description: 'Cells, systems, and study sessions.',
    activity: [
      { author: 'Sofia', text: 'Anyone want to join a study session for biology?', date: new Date(Date.now() - 4 * DAY) },
      { author: 'Noah', text: 'Count me in!', date: new Date(Date.now() - 3 * DAY) }
    ]
  }
];

const demoPosts = [
  {
    author: 'Alex',
    content: 'Finished my math review today. Feeling good!',
    comments: [
      { author: 'Mia', text: 'Nice work!' },
      { author: 'Jay', text: 'Keep it up!' }
    ]
  },
  {
    author: 'Sofia',
    content: 'Anyone want to join a study session for biology?',
    comments: [{ author: 'Noah', text: 'Count me in!' }]
  }
];

async function seedDemoData() {
  try {
    for (const g of demoGroups) {
      const exists = await Group.findOne({ name: g.name });
      if (!exists) {
        await Group.create({ ...g, members: [] });
        console.log(`Seeded demo group: ${g.name}`);
      }
    }
    for (const p of demoPosts) {
      const exists = await Post.findOne({ author: p.author, content: p.content });
      if (!exists) {
        await Post.create(p);
        console.log(`Seeded demo post by ${p.author}`);
      }
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

module.exports = seedDemoData;
