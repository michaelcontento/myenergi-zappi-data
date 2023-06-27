# myenergi-zappi-data

This repository contains (in the `data/` folder) the raw data of my [Zappi][] wallbox retreived from the official MyEnergi API. 

I do this, as the API of MyEnergi is very slow, sometimes unstable and I'm also a bit a data hoarder :joy:

A GitHub Action will auto-import new files every morning and (currently) we store the most granular data available (one datapoint per minute).

## File format / API schema

As there is no official API documentation we have to use informations gathered by the community. For this please head over to [MyEnergi-App-Api].

But for archival purpose (maybe the MyEnergi-App-Api repo get removed sometime), here the infos for the files we store:

```json
{
  "min": 1,       // Minute
  "dow": "Sat",   // Day of week
  "dom": 8,       // Day of month
  "mon": 6,       // Month
  "yr": 2019,     // Year
  "imp": 42900,   // Imported Joules this minute; divide by 60 get average Watts; divide by 3600000 to get kWh
  "exp": 260220,  // Exported Joules
  "gen": 180,     // Generated Joules Negative
  "gep": 1560,    // Generated Joules Positive
  "h1d": 600,     // Phase 1 used Joules for charging
  "h2d": 1260,    // Phase 2 used Joules for charging
  "h3d": 720,     // Phase 3 used Joules for charging
  "h1b": 12312,   // Phase 1 used Joules for charging via BOOST
  "h2b": 12312,   // Phase 2 used Joules for charging via BOOST
  "h3b": 12312,   // Phase 3 used Joules for charging via BOOST
  "v1": 2446,     // Supply Voltage (centi-volts)
  "frq": 5006,    // Supply Frequency (centi-hertz -- 50,06hz in this case)
  "pect1": 123,   // Positive Energy CT-1
  "pect2": 123,   // Positive Energy CT-2
  "pect3": 123,   // Positive Energy CT-3
  "nect1": 123,   // Negative Energy CT-1
  "nect2": 123,   // Negative Energy CT-2
  "nect3": 123,   // Negative Energy CT-3
}
```

  [Zappi]: https://www.myenergi.com/de/zappi/
  [MyEnergi-App-Api]: https://github.com/twonk/MyEnergi-App-Api
