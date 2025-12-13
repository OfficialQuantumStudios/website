const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
window.onresize = () => {
    update();
}
window.onload = () => {
    update();
    draw();
}

function random(min, max) {
    return (Math.random() * (max - min)) + min;
}

function mixRGB(color1, color2, weight = 0.5) {
    weight = Math.max(0, Math.min(1, weight));
    const r = Math.round(color1[0] * (1 - weight) + color2[0] * weight);
    const g = Math.round(color1[1] * (1 - weight) + color2[1] * weight);
    const b = Math.round(color1[2] * (1 - weight) + color2[2] * weight);
    return [r, g, b];
}

let objects = [];
function update() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const area = canvas.width * canvas.height;
    const count = Math.max(3, Math.min(12, Math.round(area / 250000)));
    objects = [];
    for (let i = 0; i < count; i++) {
        const c = mixRGB([0, 0, 255], [200, 0, 255], random(0, 1));
        objects.push({
            x: random(0 + 100, canvas.width - 100),
            y: random(0 + 100, canvas.height - 100),
            r: random(200, 250),
            d: Math.random() * 360,
            ld: Date.now(),
            c: `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.45)`,
            s: random(0.5, 1.5)
        });
    }
}

function isTouchingEdge(obj) {
    const rh = obj.r / 2;
    if ((obj.x + rh) > canvas.width || (obj.x - rh) < 0 || (obj.y + rh) > canvas.height || (obj.y - rh) < 0) {
        return true;
    }
    return false;
}

function draw(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objects.length; i++) {
        const o = objects[i];
        if (isTouchingEdge(o) && (Date.now() - o.ld) > 500) {
            o.ld = Date.now();
            o.d += 45;
            if (o.d > 360) o.d = o.d % 360;
        }
        const gradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        gradient.addColorStop(0, o.c);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        o.x += Math.cos(o.d * (Math.PI / 180)) * o.s;
        o.y += Math.sin(o.d * (Math.PI / 180)) * o.s;
    }
    setTimeout(() => {
        draw();
    }, 25);
}