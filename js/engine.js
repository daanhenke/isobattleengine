var ResourceManager = function () {
    this.resources = {};
    this.basePath = "";

    this.load_images = function (resource_array, callbacks) {
        var resman = this;
        var current_resource = resource_array[0];

        var image = new Image();
        image.src = this.basePath + current_resource;

        image.onload = function () {
            resource_array.splice(0, 1);

            resman.resources[current_resource.replace(/\.[^/.]+$/, "")] = image;

            if (callbacks.hasOwnProperty("loaded_resource"))
                callbacks["loaded_resource"]();

            if (resource_array.length == 0) {
                if (callbacks.hasOwnProperty("complete"))
                    callbacks["complete"]();
            }
            else {
                resman.load_images(resource_array, callbacks);
            }
        };

        image.onerror = function () {
            if (callbacks.hasOwnProperty("error"))
                callbacks["error"]();

            resman.load_images(resource_array, callbacks);
        }


    }
};

var RenderManager = function (engine) {
    this.engine = engine;

    this.appendCanvas = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    };

    this.clearCanvas = function (colour) {
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, colour);
    };

    this.drawRect = function (x, y, w, h, colour) {
        this.context.fillStyle = colour;
        this.context.fillRect(x, y, w, h);
        this.context.fill();
    };

    this.drawImage = function (x, y, image) {

        this.context.drawImage(image, x, y);
    };

    this.drawMap = function (offset_x, offset_y, map) {
        for (var x = 0; x < map.width; x++) {
            for (var y = 0; y < map.height; y++) {
                for (var z = 0; z < map.depth; z++) {
                    if (map.map[x][y][z] != -1)
                        this.drawImage((x - y) * map.tile_height + offset_x, (x + y) * map.tile_height / 2 - (z * map.tile_height / 2) + offset_y, this.engine.ResourceManager.resources[map.tile_table[map.map[x][y][z]]])
                }
            }
        }
    }

    this.drawMapWithDelayEffectLolY = function (offset_x, offset_y, map, delay) {
        var times = 0;
        var resman = this;
        map.map.forEach(function (row, x) {
            row.forEach(function (cell, y) {
                cell.forEach(function (tile, z) {
                    if (tile != -1) {
                        setTimeout(function () {
                            resman.drawImage((x - y) * map.tile_height + offset_x, (x + y) * map.tile_height / 2 - (z * map.tile_height / 2) + offset_y, resman.engine.ResourceManager.resources[map.tile_table[map.map[x][y][z]]])
                        }, times * delay);
                        times++;
                    }
                })
            })
        });
    }
};

var Map = function (width, height, depth, fillType, twidth, theight, tile_table) {
    this.map = [];

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.tile_width = twidth;
    this.tile_height = theight;
    this.tile_table = tile_table;

    for (var x = 0; x < width; x++) {
        row = [];
        for (var y = 0; y < height; y++) {
            heightmap = [];
            for (var z = 0; z < depth; z++) {
                if (z == 0)
                    heightmap.push(fillType);
                else
                    heightmap.push(-1);
            }
            row.push(heightmap);
        }
        this.map.push(row);
    }

    this.set_cube = function (x, y, z, w, h, d, type) {
        for (var cx = 0; cx < w; cx++) {
            for (var cy = 0; cy < h; cy++) {
                for (var cz = 0; cz < d; cz++) {
                    this.map[x + cx][y + cy][z + cz] = type;
                }
            }
        }
    };

    this.clear = function () {
        this.set_cube(0, 0, 0, this.width, this.height, this.depth, -1);
    }
    
    this.get_settings = {
        offset_x: 0,
        offset_y: 0,
        devider_position: 50,
        default_value: 3,
        multiplier_base: 8,
        multiplier_value: 3
    };

    this.generate_heightmap = function (type) {
        noise.seed(Math.random());
        for (var cx = 0; cx < this.width; cx++) {
            for (var cy = 0; cy < this.height; cy++) {
                depth = Math.abs(noise.perlin2((cx + this.get_settings.offset_x) / this.get_settings.divider_position, (cy + this.get_settings.offset_y) / this.get_settings.devider_position));
                depth += Math.max(0, (this.get_settings.default_value - depth * this.get_settings.multiplier_base) * this.get_settings.multiplier_value);
                console.log(depth);
                for (var cz = 0; cz < depth; cz++) {
                    this.map[cx][cy][cz] = type;
                }
            }
        }
    }
};

var Engine = function () {
    this.ResourceManager = new ResourceManager();
    this.RenderManager = new RenderManager(this);

    setTimeout(engine_ready, 500);
};

var GameEngine;

window.onload = function () {
    GameEngine = new Engine();
};
