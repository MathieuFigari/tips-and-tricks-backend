import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import UsersFixtures from './fixtures/01_usersFixture';
import TipsFixtures from './fixtures/02_tipsFixtures';
import PostsFixtures from './fixtures/03_postsFixtures';
import ReactionsFixtures from './fixtures/04_reactionsFixtures';

dotenv.config();

export class InitDb {
    private _pg: postgres.Sql;

    get pg(): postgres.Sql {
        return this._pg;
    }

    async init(): Promise<void> {
        // Configure SSL for production environment
        const sslConfig = process.env.ENVIRONMENT === 'production' ? {
            ssl: {
                rejectUnauthorized: true // Keep SSL verification enabled in production
            },
        } : null;

        this._pg = postgres(process.env.DATABASE_URL, sslConfig);
    }

    async readFiles(): Promise<void> {
        const sqlFiles: { schema: string[] } = {
            schema: fs.readdirSync(path.join(__dirname, './migrations/schema')),
        };
        for (const [type, files] of Object.entries(sqlFiles)) {
            await this.playSqlQueries(type, files);
        }
    }

    async playSqlQueries(type: string, files: string[]): Promise<void> {
        for (const file of files) {
            await this._pg.file(path.join(__dirname, `./migrations/${type}/${file}`));
        }
    }

    async clearDb() {
        const __dirname = path.dirname(__filename);
        return this._pg.file(path.join(__dirname, `./migrations/drop_db.sql`));
    }
}

(async () => {
    const init = new InitDb();
    await init.init();
    await init.clearDb();
    await init
        .readFiles()
        .then(() => console.log('Migrations Success !'))
        .catch((err) => console.log('Migrations failed : ' + err.message));
    if (process.env.NODE_ENV === 'production') {
        await init.pg.end();
        return;
    }
    await new UsersFixtures(init.pg).givenSomeUsers(5);
    await new TipsFixtures(init.pg).givenSomeTips(500);
    await new PostsFixtures(init.pg).givenSomePosts(500);
    await new ReactionsFixtures(init.pg).givenSomeReactions();
    await init.pg.end();
})();
