SQL Where
=========

A syntax for building simple sql queries with json.


## Options

- `table` (ex. 'contents') will prefix the attributes ex '"{table}.id" = 1'


## Examples

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