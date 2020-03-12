const fs = require("fs");
const fetch = require('node-fetch');

const content = fs.readFileSync("./data/matches.json", "utf8");
const json = JSON.parse(content);

const settings = { method: "Get" };

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function request(m) {
    console.log("request " + m.match_id);
    return fetch("https://api.opendota.com/api/matches/" + m.match_id, settings)
        .then(res => res.json())
        .then(json => {
            if (json.error) {
                throw json.error;
            } else {
                console.log("done " + m.match_id);
                fs.writeFileSync("./data/match/" + m.match_id + ".json", JSON.stringify(json));
            }
        });
}

function clean(m) {
    let path = "./data/match/" + m.match_id + ".json";
    let csv = "./data/csv/" + m.match_id + ".csv";
    let content = fs.readFileSync(path, "utf8");
    let json = JSON.parse(content);
    let table = "match,patch,date,duration,player,party_size,party_id,team,hero,level,kills,deaths,assists,denies,last_hits,hero_damage,hero_healing,tower_damage,gold,gold_spent,total_gold,total_xp,gpm,xpm,kpm,lhpm,hdpm,hhpm,win,lose" + "\r\n";
    for (var j = 0; j < json.players.length; j++) {
        let pp = json.players[j];
        let line = [
            m.match_id,
            pp.patch,
            new Date(pp.start_time * 1000).toLocaleDateString(),
            pp.duration / 60,
            pp.player_slot || pp.account_id,
            pp.party_size,
            pp.party_id,
            pp.isRadiant ? "radi" : "dire",
            pp.hero_id,
            pp.level,
            pp.kills,
            pp.deaths,
            pp.assists,
            pp.denies,
            pp.last_hits,
            pp.hero_damage,
            pp.hero_healing,
            pp.tower_damage,
            pp.gold,
            pp.gold_spent,
            pp.total_gold,
            pp.total_xp,
            pp.benchmarks.gold_per_min.raw,
            pp.benchmarks.xp_per_min.raw,
            pp.benchmarks.kills_per_min.raw,
            pp.benchmarks.last_hits_per_min.raw,
            pp.benchmarks.hero_damage_per_min.raw,
            pp.benchmarks.hero_healing_per_min.raw,
            pp.win,
            pp.lose,
        ];
        table += line.join(",") + "\r\n";
    }
    fs.writeFileSync(csv, table);
}

let slp = 0;
for (var i = 0; i < json.length; i++) {
    const m = json[i];
    if (!fs.existsSync("./data/match/" + m.match_id + ".json")) {
        slp++;
        let ss = slp;
        let ii = i;
        let mm = m;
        sleep(ss * 1000).then(() => {
            console.log("progress " + ii + "/" + json.length);
            request(mm);
        });
    } else {
        if (!fs.existsSync("./data/csv/" + m.match_id + ".csv")) {
            console.log("clean " + m.match_id);
            clean(m);
        } else {
            console.log("skip " + m.match_id);
        }
    }
}

console.log('done');