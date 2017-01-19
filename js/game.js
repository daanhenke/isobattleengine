function engine_ready() {
    GameEngine.ResourceManager.basePath = "gfx/";
    GameEngine.ResourceManager.load_images(["gray.png", "blue.png"], {complete: function () {
        GameEngine.RenderManager.appendCanvas(document.getElementById("mainRenderingCanvas"));

        var map = new Map(20, 16, 12, 0, 32, 16, ["gray", "blue"]);

        map.generate_heightmap(0);
        //map.set_cube(4, 8, 0, 4, 5, 9, 1);

        GameEngine.RenderManager.drawMap(300, 100, map);
        //GameEngine.RenderManager.drawMapWithDelayEffectLolY(300, 100, map, 1);
    }});
}