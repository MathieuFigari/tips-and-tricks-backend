import { defineConfig } from 'vite';
import {VitePluginNode} from 'vite-plugin-node';
import * as dotenv from "dotenv";
dotenv.config()

export default defineConfig(() => ({
    server: {
        port: 5000
    },

    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/index.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild',
            swcOptions: {}
        })
    ],
}));