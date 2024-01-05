import { Sql } from 'postgres';

export default class TagsFixtures {
    private static readonly developmentTags = [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'CSS',
        'HTML',
        'Angular',
        'Vue.js',
        'Docker',
        'Git',
        'SQL',
        'NoSQL',
        'Python',
        'Java',
        'C#',
        'PHP',
        'Ruby',
        'Go',
        'Swift',
        'Kotlin',
    ];

    constructor(private readonly _sql: Sql) {}

    public async givenDevelopmentTags() {
        const selectedTags = TagsFixtures.developmentTags
            .sort(() => 0.5 - Math.random())
            .slice(0, 10)
            .map((label) => ({ label }));

        await this._sql`insert into "tag" ${this._sql(selectedTags)}`.then((rows) => rows.length);
    }
}
