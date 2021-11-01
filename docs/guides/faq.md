---
id: faq
title: 'Frequently Asked Questions'
---

### Do binaries get automatically deleted?

No, this package will **not** delete any binaries, so after an system / package upgrade the binaries may have to be cleaned manually.

### Why is there no documentation about class-options / interfaces in the documentation?

It is currently recommended to directly look at the TSDoc for these properties to get their type & documentation.

### Do testing database paths get cleaned up?

If the Database if a temporary directory (generated with `tmp`), then it will automatically get cleaned-up when calling `.stop()`, this can be disabled with `.stop(false)`.  
If the Database if manually set (set with `dbPath`), then it needs to be manually cleaned-up with `.cleanup(true)`.
