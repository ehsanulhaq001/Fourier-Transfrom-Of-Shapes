function fourierTransform(points, z) {
    let X = [];
    let n = points.length;
    for (let i = 0; i < n; i++) {
        let re = 0;
        let im = 0;
        for (let j = 0; j < n; j++) {
            let angle = (2 * Math.PI / n) * i * j;
            re += points[j][z] * Math.cos(angle);
            im -= points[j][z] * Math.sin(angle);
        }
        re = re / n;
        im = im / n;
        X.push({ re, im });
    }
    return X;
}