const Potion = {
    Regeneration: {
        Cost: 21,
        Recipe: ['empty_bottle', 'nether_wart', 'ghast_tear']
    },
    Swiftness: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'sugar']
    },
    FireResistance: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'magma_cream']
    },
    Healing: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'glistering_melon']
    },
    NightVision: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'golden_carrot']
    },
    Strength: {
        Cost: 21,
        Recipe: ['empty_bottle', 'nether_wart', 'blaze_powder']
    },
    Invisibility: {
        Cost: 11,
        Recipe: ['empty_bottle', 'nether_wart', 'golden_carrot', 'fermented_spider_eye']
    },
    Poison: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'spider_eye']
    },
    Weakness: {
        Cost: 4,
        Recipe: ['empty_bottle', 'fermented_spider_eye']
    },
    Slowness: {
        Cost: 11,
        Recipe: ['empty_bottle', 'nether_wart', 'sugar', 'fermented_spider_eye']
    },
    Harming: {
        Cost: 11,
        Recipe: ['empty_bottle', 'nether_wart', 'glistering_melon', 'fermented_spider_eye']
    }
};

const BrewingShop = {
    BrewingStand: 10,
    Bottles: 1,
    NetherWart: 5,
    Redstone: 3,
    FermentedSpiderEye: 3,
    MagmaCream: 2,
    Sugar: 2,
    GlisteringMelon: 2,
    GhastTear: 15,
    GoldenCarrot: 2,
    SpiderEye: 2,
    BlazePowder: 15
};

const IngredientsTable = {
    blaze_powder: 0,
    brewing_stand: 0,
    empty_bottle: 0,
    fermented_spider_eye: 0,
    ghast_tear: 0,
    glistering_melon: 0,
    glowstone_dust: 0,
    golden_carrot: 0,
    gunpowder: 0,
    magma_cream: 0,
    nether_wart: 0,
    redstone: 0,
    spider_eye: 0,
    sugar: 0,
};

const TDTH = {
    remove(id) {
        const firstRow = document.getElementById(id),
            secondRow = document.getElementById(id + '-count');
        firstRow.parentNode.removeChild(firstRow);
        secondRow.parentNode.removeChild(secondRow);
    },
    add(id, val) {
        const tableRowFirst = document.getElementById('ingredients-first-row'),
            tableRowSecond = document.getElementById('ingredients-second-row');
        const th = document.createElement('th');
        th.id = id;
        const img = new Image();
        img.src = 'assets/' + id + '.png';
        th.appendChild(img);

        tableRowFirst.appendChild(th);

        const td = document.createElement('td');
        td.id = id + '-count';
        td.innerHTML = val;

        tableRowSecond.appendChild(td);
    },
    modify(id, val) {
        const td = document.getElementById(id + '-count');
        td.innerHTML = val;
    }
}

const Totals = {
    blaze_powder: 0,
    brewing_stand: 0,
    empty_bottle: 0,
    fermented_spider_eye: 0,
    ghast_tear: 0,
    glistering_melon: 0,
    glowstone_dust: 0,
    golden_carrot: 0,
    gunpowder: 0,
    magma_cream: 0,
    nether_wart: 0,
    redstone: 0,
    spider_eye: 0,
    sugar: 0
}

let showStacks = false;
let includeStand = false;
let excludeRedstoneCost = false;

const update = element => {
    const tableRowChildren = element.parent().parent().children();
    const [dropdownTd, setsTd, brewingStandTd, totalGold] = tableRowChildren.map(index => $(tableRowChildren[index]));
    const Sets = {
        td: setsTd,
        input: setsTd.children().first()
    };
    const BrewingStands = {
        td: brewingStandTd,
        input: brewingStandTd.children().first()
    };
    const PotionOption = {
        td: dropdownTd,
        selection: dropdownTd.children().first()
    };
    let sets = Sets.input.val(),
        brewingStands = BrewingStands.input.val(),
        potionName = PotionOption.selection.val(),
        extra = 0;



    if (isNum(sets)) {
        sets = parseInt(sets);
        Sets.td.css('backgroundColor', 'white');
        Sets.input.css('backgroundColor', 'white');
    } else {
        if (sets) {
            Sets.td.css('backgroundColor', '#FF495C');
            Sets.input.css('backgroundColor', '#FF495C');
        } else {
            Sets.td.css('backgroundColor', 'white');
            Sets.input.css('backgroundColor', 'white');
        }
        sets = 0;
    }

    if (isNum(brewingStands)) {
        brewingStands = parseInt(brewingStands);
        BrewingStands.td.css('backgroundColor', 'white');
        BrewingStands.input.css('backgroundColor', 'white');
    } else {
        if (brewingStands) {
            BrewingStands.td.css('backgroundColor', '#FF495C');
            BrewingStands.input.css('backgroundColor', '#FF495C');
        } else {
            BrewingStands.td.css('backgroundColor', 'white');
            BrewingStands.input.css('backgroundColor', 'white');
        }
        brewingStands = 0;
    }

    if (includeStand) {
        const cell = element.parent()[0].cellIndex;
        if (cell === 1) {
            brewingStands = sets;
            BrewingStands.input.val(brewingStands === 0 ? '' : brewingStands);
        } else if (cell == 2) {
            sets = brewingStands;
            Sets.input.val(sets === 0 ? '' : sets);
        }
    }

    if (potionName.includes(' ')) {
        const arr = potionName.split(' ');
        potionName = '';
        arr.forEach(word => {
            if (word === 'Ext.') {
                if (!excludeRedstoneCost)
                    extra += BrewingShop.Redstone;
            } else if (word !== 'II' && word !== 'Splash')
                potionName += word;
        });
    }

    const goldForRow = (sets * (Potion[potionName].Cost + extra)) + (brewingStands * BrewingShop.BrewingStand);
    totalGold.text(showStacks ? convertToStacks(goldForRow) : goldForRow);
    readPotionChart();
}

const readPotionChart = () => {
    const table = $('#potionChart').children().first().children();
    let total = 0;
    resetTotals();
    for (let x = 1; x < table.length - 1; x++) {
        const tableRowChildren = $(table[x]).children();
        const [dropdownTd, setsTd, brewingStandTd, totalGold] = tableRowChildren.map(index => $(tableRowChildren[index]));
        const Sets = {
            td: setsTd,
            input: setsTd.children().first()
        };
        const BrewingStands = {
            td: brewingStandTd,
            input: brewingStandTd.children().first()
        };
        const PotionOption = {
            td: dropdownTd,
            selection: dropdownTd.children().first()
        };

        if (totalGold.text().includes(' ')) {
            let arr = totalGold.text().split(' ');
            if (arr.length > 2)
                continue;
            totalGold.text(convertToBlocks(totalGold.text()));
        }

        if (isNum(totalGold.text())) {
            let sets = Sets.input.val(),
                brewingStands = BrewingStands.input.val(),
                potionName = PotionOption.selection.val();

            let hasExt = potionName.includes('Ext.');

            if (potionName.includes(' ')) {
                const arr = potionName.split(' ');
                potionName = '';
                arr.forEach(word => {
                    if (isNum(sets)) {
                        if (word === 'Ext.')
                            Totals.redstone += parseInt(sets);
                        else if (word === 'II')
                            Totals.glowstone_dust += parseInt(sets);
                        else if (word === 'Splash')
                            Totals.gunpowder += parseInt(sets);
                    }
                    if (word !== 'II' && word !== 'Splash' && word !== 'Ext.')
                        potionName += word;
                });
            }

            if (isNum(brewingStands) && brewingStands !== '0')
                Totals.brewing_stand += parseInt(brewingStands);

            if (isNum(sets)) {
                const arr = Potion[potionName].Recipe;
                arr.forEach(x => {
                    Totals[x] += parseInt(sets);
                });
            }
            sets = isNum(sets) ? parseInt(sets) : 0;
            brewingStands = isNum(brewingStands) ? parseInt(brewingStands) : 0;
            const current = (sets * (Potion[potionName].Cost + (!hasExt ? 0 : (excludeRedstoneCost ? 0 : 3)))) + (brewingStands * BrewingShop.BrewingStand);
            total += current;
            totalGold.text(showStacks ? convertToStacks(current) : current);
        }
    }
    table.last().children().last().text(showStacks ? convertToStacks(total) : total);
    for (const prop in IngredientsTable) {
        if (IngredientsTable[prop] !== Totals[prop]) {
            if (Totals[prop] === 0) {
                TDTH.remove(prop);
            } else if (IngredientsTable[prop] === 0) {
                TDTH.add(prop, Totals[prop]);
            } else {
                TDTH.modify(prop, Totals[prop]);
            }
            IngredientsTable[prop] = Totals[prop];
        }
    }
}

const resetTotals = () => {
    for (let prop in Totals)
        Totals[prop] = 0;
}

const isNum = string => {
    return /^\d+$/.test(string);
}

const convertToStacks = number => {
    return Math.floor(number / 64) + ' ' + (number % 64);
}

const convertToBlocks = stacksAndBlocks => {
    const arr = stacksAndBlocks.split(' ');
    return parseInt(arr[0]) * 64 + parseInt(arr[1]);
}

$(document).ready(() => {

    const conversionButton = $('#conversionButton');
    conversionButton.click(function () {
        showStacks = !showStacks;
        this.textContent = showStacks ? 'Stacks' : 'Blocks';
        const totalGoldRows = $('.totalGoldRow');
        for (const cell of totalGoldRows) {
            const e = $(cell);
            const current = e.text();
            const converted = showStacks ? convertToStacks(parseInt(current)) : convertToBlocks(current);
            e.text(converted);
        }
    });
    conversionButton.mouseover(function () {
        this.style.backgroundColor = showStacks ? '#D8315B' : 'white';
        this.style.color = showStacks ? '#FFFAFF' : '#D8315B';
    });
    conversionButton.mouseleave(function () {
        this.style.backgroundColor = !showStacks ? '#D8315B' : 'white';
        this.style.color = !showStacks ? '#FFFAFF' : '#D8315B';
    });

    const standButton = $('#includeStand');
    standButton.click(function () {
        includeStand = !includeStand;
        this.textContent = 'With' + (includeStand ? ' ' : 'out ') + 'Stand';
    });
    standButton.mouseover(function () {
        this.style.backgroundColor = includeStand ? '#D8315B' : 'white';
        this.style.color = includeStand ? '#FFFAFF' : '#D8315B';
    });
    standButton.mouseleave(function () {
        this.style.backgroundColor = !includeStand ? '#D8315B' : 'white';
        this.style.color = !includeStand ? '#FFFAFF' : '#D8315B';
    });

    const redstoneButton = $('#excludeRedstoneCost');
    redstoneButton.click(function () {
        excludeRedstoneCost = !excludeRedstoneCost;
        this.textContent = (excludeRedstoneCost ? 'Ex' : 'In') + 'clude Redstone Cost';
        // TODO make this better
        readPotionChart();
    });
    redstoneButton.mouseover(function () {
        this.style.backgroundColor = excludeRedstoneCost ? '#D8315B' : 'white';
        this.style.color = excludeRedstoneCost ? '#FFFAFF' : '#D8315B';
    });
    redstoneButton.mouseleave(function () {
        this.style.backgroundColor = !excludeRedstoneCost ? '#D8315B' : 'white';
        this.style.color = !excludeRedstoneCost ? '#FFFAFF' : '#D8315B';
    });

    const potionChartInputs = $('.potionChartInput');
    for (const input of potionChartInputs) {
        const e = $(input);
        e.keyup(() => update(e));
    }

    const dropdowns = $('.dropdown');
    for (const dropdown of dropdowns) {
        const e = $(dropdown);
        e.mouseup(() => update(e));
    }
});