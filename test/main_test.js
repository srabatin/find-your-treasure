const assert = require("assert");
const Map = require("../main.js")

describe("Class Map", () => {
  // setup
  const height = 7;
  const width = 7;
  const percentHoles = 0.2;
  let testMap = new Map(height, width, percentHoles);

  it("templates empty map object with field constants", () => {
    // setup
    const arg1 = "rows";
    const arg2 = "cols";
    const arg3 = "percentHoles";
    const expectedResult = {}
    expectedResult[arg1] = height;
    expectedResult[arg2] = width;
    expectedResult[arg3] = percentHoles;

    // verify
    assert.strictEqual(testMap[arg1], expectedResult[arg1]);
  });

  describe(".generateMap", () => {
    // exercise 
    testMap.generateMap();

    it("generates a map array", () => {
      // exercise 
      const result = Array.isArray(testMap.map);

      // verify
      assert.ok(result);
    });

    it("generates a random random array", () => {
      // exercuse
      let testMap2 = new Map(height, width, percentHoles);
      testMap2.generateMap();

      // setup
      const map1 = testMap.map;
      const map2 = testMap2.map;

      // verify
      assert.notDeepStrictEqual(map1, map2);

    });

    it("generates a map array of the desired dimensions", () => {
      // setup
      const expectedRows = height;
      const expectedCols = width;
      
      // exercise
      const resultRows = testMap.map.length;
      const resultCols = testMap.map[0].length;
      
      // verify
      assert.strictEqual(resultRows, expectedRows);
      assert.strictEqual(resultCols, expectedCols);

    });

    it("generates a map array widh the right amount of holes", () => {
      // setup
      const expectedHoles = Math.floor(height * width * percentHoles);
      let resultHoles = 0;

      // exercise
      for (let i = 0; i < testMap.map.length; i++) {
        testMap.map[i].forEach(function (element) {
          if (element === testMap.hole) {
            resultHoles++;
          }
        })
      }
      
      // verify
      assert.strictEqual(resultHoles, expectedHoles);
    });

    it("generates a map with a player on it", () => {
      // setup
      let index = -1;

      // exercise
      for (i = 0; i < testMap.map.length; i++) {
        index = testMap.map[i].findIndex(element => element === testMap.player);
        if (index >= 0) {break}
      }
      
      // verify
      assert.ok(index >= 0);
    });

    it("generates a map with a treasure on it", () => {
      // setup
      let index = -1;

      // exercise
      for (i = 0; i < testMap.map.length; i++) {
        index = testMap.map[i].findIndex(element => element === testMap.treasure);
        if (index >= 0) {break}
      }
      
      // verify
      assert.ok(index >= 0);
    });

  });
});
