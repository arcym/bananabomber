var Geometry = require("./Geometry")
var Entity = require("./Entity")
var Smoke = require("./Smoke")

class Bomb extends Entity {
    constructor(protobomb) {
        super()
        this.position = new Geometry.Point(protobomb.position)
        this.position.x += BLOCK * 0.5
        this.position.y += BLOCK * 0.5
        this.size = BLOCK * 0.9

        this.id = this.position.toString()

        this.bomber = protobomb.bomber
        this.model = protobomb.model
        this.fuse = 1
    }
    render() {
        return {
            color: "#111",
            width: this.size,
            height: this.size,
            roundness: this.size,
            x: this.position.x - (this.size / 2),
            y: this.position.y - (this.size / 2),
        }
    }
    update(tick) {
        this.fuse -= tick
        if(this.fuse <= 0) {
            this.boom({
                intensity: 1,
                position: this.position.toPoint()
            })
            this.game.remove("bombs", this)
            this.bomber.prebombs.push(this.model)
        }
    }
    boom(protoboom) {
        var position = new Geometry.Point(protoboom.position)
        var direction = protoboom.direction || "all"
        var intensity = protoboom.intensity || 0

        var key = position.toString()
        var block = this.game.blocks[key]

        // boom does not reach through walls
        if(!!block && block.type == "wall") {
            return
        }

        // boom does not reach outside of arena.
        if(position.x < 0 || position.x > this.game.arena.width
        || position.y < 0 || position.y > this.game.arena.height) {
            return
        }

        // boom can reach through crates, but
        // unless it is a piercing boom, will
        // stop at the crate.
        if(!!block && block.type == "crate") {
            this.game.remove("blocks", block)
            intensity = 0
        }

        this.game.add("smoke", new Smoke({
            position: position.toPoint()
        }))

        if(intensity > 0) {
            if(direction == "all"
            || direction == "north") {
                this.boom({
                    direction: "north",
                    intensity: intensity - 1,
                    position: position.toPoint({by: -1})
                })
            } if(direction == "all"
            || direction == "south") {
                this.boom({
                    direction: "south",
                    intensity: intensity - 1,
                    position: position.toPoint({by: +1})
                })
            } if(direction == "all"
            || direction == "west") {
                this.boom({
                    direction: "west",
                    intensity: intensity - 1,
                    position: position.toPoint({bx: -1})
                })
            } if(direction == "all"
            || direction == "east") {
                this.boom({
                    direction: "east",
                    intensity: intensity - 1,
                    position: position.toPoint({bx: +1})
                })
            }
        }
    }
}

export default Bomb
