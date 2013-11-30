SQL Where
=========

[![Build Status](https://travis-ci.org/publicclass/sql-where.png?branch=master)](https://travis-ci.org/publicclass/sql-where)

Build simple SQL WHERE conditions using JSON.

## How?

Here's a few examples:

```
{id: 1} -> 'id = 1'
[{id: 1}, {type: 'photo'}] -> 'id = 1 OR type = "photo"'
{id: 1, type: 'photo'} -> 'id = 1 AND type = "photo"'
{type:['photo','video']} -> 'type IN ("photo","video")'
{type:{not:'text'}} -> 'type != "text"'
{type:{not:['text','video']}} -> 'type NOT IN ("text","video")'
{type:{like:'te%'}} -> 'type LIKE "te%"'
{type:{like:['te%','x']}} -> error
```

## Why?

It's rather convenient to be able to use JSON instead of manually building the WHERE conditions. This is also [node-postgres](https://github.com/brianc/node-postgres) friendly and separates the values from the SQL to be able to use [Parameterized Queries](https://github.com/brianc/node-postgres/wiki/Prepared-Statements#parameterized-queries).

## API

### where(query[,options]) -> Where

This is really all the API you need to learn. Pass in an object like the one of the examples above in [How?](#how). Then you can either a

### new Where(options)

Options:

- `table` (ex. 'contents') will prefix the attributes ex '"{table}.id" = 1'

### Where#sql

The generated SQL conditions from the parsed `query`.

Example: `type = $1`

### Where#values

An array of values to be used in a parameterized query.

Example: `[1,'bob']`

### Where#parse(query)

This does the magic of creating conditions from a JSON object.

### Where#toString()

This generates a non-parameterized SQL string from [#sql](#where-sql) and [#values](#where-values).

__NOTE__ The generated SQL condition is in no way guaranteed to be properly escaped. It only does very simple string escaping. And according to [people way smarter than me](www.codinghorror.com/blog/2005/04/give-me-parameterized-sql-or-give-me-death.html) manually escaping any queries will never be enough to counter SQL injections. So please only use this for debugging.

