/**
 * Erstellt ein neues Level-Objekt für Level 1 mit vorkonfigurierten Endgegnern, Wolken, Flaschen, Münzen und Hintergrundobjekten.
 *
 * @type {Level}
 */
let level1 = new Level(
    /**
     * Array mit Endgegnern für das Level.
     * @type {Endboss[]}
     */
    [
        new Endboss()
    ],
    /**
     * Array mit Wolken-Objekten.
     * @type {Cloud[]}
     */
    [
        new Cloud()
    ],
    /**
     * Array mit Flaschen (Sammelobjekte).
     * @type {Bottle[]}
     */
    [
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
        new Bottle(),
    ],
    /**
     * Array mit Münzen (Sammelobjekte).
     * @type {Coins[]}
     */
    [
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
    ],
    /**
     * Array mit Hintergrundobjekten, die als Parallax-Ebenen dienen.
     * @type {BackgroundObject[]}
     */
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
        
        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),
        
        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
        
        new BackgroundObject('img/5_background/layers/air.png', 719*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),
    ]
);

/**
 * Initialisiert das Level 1 mit einer spezifischen Zusammenstellung von Gegnern, Sammelobjekten und Hintergrundobjekten.
 *
 * @function
 * @returns {Level} Gibt ein neues, vollständig initialisiertes Level-Objekt für Level 1 zurück.
 */
function initLevel1() {
    return new Level(
        /**
         * Array mit Gegnern (Hühner und Endgegner) für das Level.
         * @type {Array<Chicken|TinyChicken|Endboss>}
         */
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new TinyChicken(),
            new TinyChicken(),
            new TinyChicken(),
            new Endboss()
        ],
        /**
         * Array mit Wolken-Objekten.
         * @type {Cloud[]}
         */
        [
            new Cloud()
        ],
        /**
         * Array mit Flaschen (Sammelobjekte).
         * @type {Bottle[]}
         */
        [
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
        ],
        /**
         * Array mit Münzen (Sammelobjekte).
         * @type {Coins[]}
         */
        [
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
            new Coins(),
        ],
        /**
         * Array mit Hintergrundobjekten, die als Parallax-Ebenen dienen.
         * @type {BackgroundObject[]}
         */
        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
            
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            
            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),
            
            new BackgroundObject('img/5_background/layers/air.png', 719*2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
            
            new BackgroundObject('img/5_background/layers/air.png', 719*3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),
        ]
    );
}

// Ruft die initiale Level-Initialisierung direkt nach dem Laden auf.
initLevel1();