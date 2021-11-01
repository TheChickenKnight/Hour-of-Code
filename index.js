const { Vec3 } = require('vec3');

var bot = require('mineflayer').createBot({
  host: "ebfirstmc.siddharthlohani.dev",
  port: "25613",   
  username: "Dream",
  version: "1.17.1"
});

bot.move = async (direction, steps) => {
    if (direction === "right")direction = "left";
    else if (direction === "left")direction = "right";
    bot.setControlState(direction, true);
    await new Promise(res => setTimeout(res, steps/0.004317));
    bot.setControlState(direction, false);
};

bot.onBlock = () => bot.blockAt(new Vec3(bot.player.entity.position.x, bot.player.entity.position.y - 1, bot.player.entity.position.z));

bot.once('login', err => {
    if (err) {
        console.error(err);
    }
    bot.on('chat', async (username, message) => {
       if (/go (forward|back|left|right) [0-9]+ block(s|)/.test(message)) {
            await bot.move(message.split(' ')[1], message.split(' ')[2]);
       } else if (message === "go" && bot.onBlock().name == 'green_concrete') {
            await bot.move("forward", 1);
            var block = { name: "magenta_glazed_terracotta" };
            while (block.name !== "red_concrete") {
                await new Promise(res => setTimeout(res, 500));
                block = bot.onBlock();
                let direction;
                if (block.name !== "magenta_glazed_terracotta" && block.name !== "green_concrete")break;
                switch(block.getProperties().facing) {
                    case 'north': direction = 'forward';
                    break;
                    case 'east':  direction = 'right';
                    break;
                    case 'west':  direction = 'left';
                    break;
                    case 'south':  direction = 'back';
                    break;
                }
                await bot.move(direction, 1);
            } 
       }
    });
});

