# dodota

Get dota2 matches for further analysis.

# Prepare env

Execute
```
npm i
```

Create folders:
- data\csv\
- data\match\

# Get list of matches

URL Template for 'All Pick' for Player `{ID}`:
```
https://api.opendota.com/api/players/{ID}/matches?significant=0&game_mode=22&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=start_time&project=version&project=kills&project=deaths&project=assists&project=skill&project=leaver_status&project=party_size&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5&project=backpack_0
```

Save to `data\matches.json`.

# Get matches one by one

Execute
```
npm run-script request
```

# Concat results to csv

Execute
```
npm run-script merge
```