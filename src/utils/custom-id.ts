import * as snowflake from 'snowflake-id';


export function createCustomId(label: string): string {
    const id = snowflake.generate();
    return `${label}-${id}`;
}