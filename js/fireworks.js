// fireworks.js
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

class Firework {
    constructor(x, y, height, velocity) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.velocity = velocity;
        this.alpha = 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机颜色
        this.particles = []; // 用于存放爆炸后的粒子
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(this.x, this.y, 2, 10); // 绘制火花主体
        ctx.globalAlpha = 1; // 恢复透明度
    }

    update() {
        this.draw();
        this.y -= this.velocity; // 向上移动

        // 模拟速度衰减，让火花更真实
        this.velocity *= 0.98;

        // 当达到一定高度时，开始爆炸
        if (this.y <= this.height) {
            this.explode();
        }

        // 减少透明度，直到消失
        this.alpha -= 0.01;

        return this.alpha <= 0; // 当完全透明时，移除火花
    }

    explode() {
        const numberOfParticles = Math.floor(Math.random() * (100 - 50 + 1)) + 50;  // 随机粒子数量 (50-100)

        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
        this.alpha = 0; // 立即隐藏火花主体
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        // 随机方向和速度
        this.angle = Math.random() * Math.PI * 2; // 随机角度
        this.speed = Math.random() * 5 + 1;     // 随机速度

        this.alpha = 1;                          // 初始透明度
        this.gravity = 0.05;
        this.friction = 0.95;

        this.vx = Math.cos(this.angle) * this.speed; // x 轴速度
        this.vy = Math.sin(this.angle) * this.speed; // y 轴速度
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }

    update() {
        this.draw();

        // 模拟重力
        this.vy += this.gravity;

        // 模拟摩擦力
        this.vx *= this.friction;
        this.vy *= this.friction;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 减少透明度
        this.alpha -= 0.01;

        return this.alpha <= 0; // 当完全透明时，移除粒子
    }
}


function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const height = Math.random() * canvas.height / 2 + canvas.height / 4; // 随机高度
    const velocity = Math.random() * 5 + 5; // 随机速度

    fireworks.push(new Firework(x, y, height, velocity));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 稍微降低透明度，产生拖尾效果
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 创建烟花
    if (Math.random() < 0.05) {
        createFirework();
    }

    // 更新和绘制烟花
    fireworks = fireworks.filter(firework => {
        firework.particles = firework.particles.filter(particle => !particle.update());
        return !firework.update(); // 使用 ! 取反
    });
}

// 启动动画
animate();

// 窗口大小改变时，重新调整画布大小
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
