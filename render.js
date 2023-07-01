#!/usr/bin/env node 

import { markdownTable } from 'markdown-table'
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs'

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes())
        ].join(':')
    );
}

function renderMonth(month) {
    let data = []
    let basePath = './data/2023/' + month
    readdirSync(basePath)
        .forEach((f) => {
            if (!f.endsWith(".json")) {
                return
            }

            let content = readFileSync(basePath + "/" + f)
            let obj = JSON.parse(content)
            data = [...data, ...obj]
        })

    data = data
        .filter((x) => {
            return x.hasOwnProperty('h1d')
                || x.hasOwnProperty('h2d')
                || x.hasOwnProperty('h3d')
        })
        .map((x) => {
            x['watts'] = (x['h1d'] ?? 0)
                + (x['h2d'] ?? 0)
                + (x['h3d'] ?? 0)
                + (x['h1b'] ?? 0)
                + (x['h2b'] ?? 0)
                + (x['h3b'] ?? 0)

            x['min'] = x['min'] ?? 0

            // https://github.com/ashleypittman/mec/blob/master/get_zappi_history.py#L185
            // https://myenergi.info/viewtopic.php?p=82879#p82879
            x['watts'] = x['watts'] / 60 / 60

            return x
        })

    let result = {}
    let lastDate = null
    let idx = -1
    data.forEach((x) => {
            let rowDate = new Date();
            rowDate.setMonth(x['mon'] - 1)
            rowDate.setDate(x['dom'])
            rowDate.setHours(x['hr'])
            rowDate.setMinutes(x['min'])
            rowDate.setSeconds(0)

            let diffInMinutes = lastDate == null
                ? 100000
                : Math.floor((rowDate - lastDate) / 1000) / 60

            if (diffInMinutes <= 15) {
                result[idx]['watts'] += x['watts']
                result[idx]['date_end'] = rowDate
                result[idx]['hr_end'] = x['hr']
                result[idx]['min_end'] = x['min']
            } else {
                idx += 1
                result[idx] = x
                result[idx]['date_start'] = rowDate
                result[idx]['hr_start'] = x['hr']
                result[idx]['min_start'] = x['min']
                result[idx]['date_end'] = rowDate
                result[idx]['hr_end'] = x['hr']
                result[idx]['min_end'] = x['min']
            }

            lastDate = rowDate
        })
    result = Object.values(result)

    if (existsSync("data/corrections-" + month + ".json")) {
        let manualCorrectionsStr = readFileSync("data/corrections-" + month + ".json")
        let manualCorrections = JSON.parse(manualCorrectionsStr)
        manualCorrections = manualCorrections.map(x => {
            x['date_start'] = new Date(x['date_start'])
            x['date_end'] = new Date(x['date_end'])
            return x
        })
        result = [...result, ...manualCorrections]
    }

    const pricePerKwh = 0.4944
    let mdDate = [['Start', 'End', 'Amount', 'Price / kWh', 'Price']]
    let sum = 0;
    result.forEach(x => {
        let price = (Math.round(x['watts'] / 10 * pricePerKwh) / 100)
        let kWh = Math.round(x['watts'] / 10) / 100

        if (kWh < 1) {
            return
        }

        mdDate.push([
            formatDate(x['date_start']),
            formatDate(x['date_end']),
            kWh.toFixed(2) + ' kWh',
            pricePerKwh.toFixed(2) + ' €',
            price.toFixed(2) + ' €'
        ])
        sum += x['watts']
    })
    mdDate.push([
        '',
        '**Total sum**',
        '**' + (Math.round(sum / 10) / 100).toFixed(2) + ' kWh**',
        '**' + (pricePerKwh).toFixed(2) + ' €**',
        '**' + (Math.round(sum / 10 * pricePerKwh) / 100).toFixed(2) + ' €**'
    ])
    var a = markdownTable(mdDate, {align: ['l', 'r', 'r', 'r', 'r']})

    writeFileSync(basePath + '/README.md', a)
}

readdirSync('data/2023')
.forEach(x => {
    renderMonth(x)
})

// renderMonth('05')
// renderMonth('06')
