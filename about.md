---
layout: page
title : About
permalink: /about/
---
<h2><center>Nilay Shrivastava</center></h2>
<!-- [Nilay]({{site.baseurl}}/assets/image.jpg){:height="250em" style="float: left;margin-right: 20px;margin-top: 7px"} -->
I am a graduate of the Computer Engineering department at Netaji Subhas Institute of Technology (NSIT). My interests span across Mathematics (specifically Topology, Stochastic Calculus), Deep Learning, Gradient free Optimization algorithms and Quantum Computing/Information Processing. After graduating from NSIT, I did an internship with Adobe's Media and Data Science Research Group (based in Noida, India). My internship project was about doing generative modeling in the domain of quantum machine learning. During my undergraduate degree, I also managed to squeeze internships at a startup Zeg.ai and then at Samsung Research, Banglore where I worked on constructing Deep Nets for low power devices. I also worked at [MIDSA@IIITD](http://midas.iiitd.edu.in/) under the guidance of [Dr. Rajiv Ratn Shah](), [Dr. Debanjan Mahata (Bloomberg, NY)](https://scholar.google.com/citations?user=8F1SwO0AAAAJ&hl=en) and [Dr. Amanda Stent (Bloomberg, NY)](https://cra.org/cra-w/amanda-stent/). My work there revolved around visual speech recognition. Currently, I am a full-time employee at Adobe Systems.

I am a [KVPY](https://en.wikipedia.org/wiki/Kishore_Vaigyanik_Protsahan_Yojana) and [NTSE](https://en.wikipedia.org/wiki/National_Talent_Search_Examination) scholar too. For more, you can find my resume [here.](/assets/pdfs/NilayShrivastava.pdf)

Apart from mainstream academic work, I maintain this blog. I have also built a JavaScript library [Qu.js (do check it out](https://github.com/euler16/Qu.js)!).
> What is this pendulum doing here? This interactive double pendulum simulation is based on equations derived using Lagrangian (the name of this website!!) formulation of Classical Mechanics. Finding the equations governing the motion of double pendulum system is one of the first problems used to demonstrate the ease and efficacy of this formulation over Newton's equations.
<br>
<center>
<div id="canvas"></div>
</center>
<script src="../js/p5.min.js"></script>
<script src="../js/p5.dom.min.js"></script>
<script type="text/javascript">
// screen size
function doublePendulum(p) {
    let screenW = 512;
    let screenH = 236;
    // colors
    let bgcolor = 51;
    let textcolor = "#A9BCD0";
    let linecolor = 255;
    // pendulum sizes/physics
    let r1 = (screenW / 6);
    let r2 = (screenW / 6);
    let m1 = 10.0;
    let m2 = 10.0;
    let a1 = 0;
    let a2 = 0;
    let a1_v = 0.0;
    let a2_v = 0.0;
    let a1_a = 0.0;
    let a2_a = 0.0;
    let g = 0.5;
    let ballDiameter = 8;
    let dampening = 0.998;
    // ball points
    let x1;
    let y1;
    let x2;
    let y2;
    let rectX = 30;
    let rectY = 10;
    let halfRectX = rectX/2;
    let halfRectY = rectY/2; 
    let lastPtsX = [];
    let lastPtsY = [];
    let len = 200;
    let canvas;
    // state
    let dragging = false;
    const PI = p.PI;
    /// trigonometric functions
    p.setup = () => {
        // create canvas
        canvas = p.createCanvas(screenW, screenH);
        canvas.parent("canvas");
        // set default state
        a1 = PI / 4;
        a2 = -PI / 8;
        for (let i = 0; i < len; ++i) {
            lastPtsX.push(0);
            lastPtsY.push(0);
        }
    }
    p.draw = () => {
        p.background(bgcolor);
        // line styling
        p.stroke(linecolor);
        p.strokeWeight(3);
        p.fill(linecolor);
        //p.fill(linecolor);
        p.rect(p.width / 2 - halfRectX, p.height / 20 - halfRectY, rectX, rectY);
        // translate to center
        p.translate(p.width / 2, p.height/20);
        calcPolarPoints();
        // draw pendulum
        p.line(0, 0, x1, y1);
        p.ellipse(x1, y1, ballDiameter, ballDiameter);
        let colotPt;
        p.strokeWeight(1);
        for (let i = 0; i < len - 3; ++i) {
            colorPt = p.map(i, 0, len, 51, 240);
            p.stroke(colorPt);
            p.line(lastPtsX[i], lastPtsY[i], lastPtsX[i + 1], lastPtsY[i + 1]);
        }
        p.strokeWeight(3);
        p.stroke(linecolor)
        p.line(x1, y1, x2, y2);
        p.ellipse(x2, y2, ballDiameter, ballDiameter);
        // calculate angles
        calcAngles();
        applyForces();
        dampenVelocities();
    }
    function calcPolarPoints() {
        // ball 1
        x1 = r1 * p.sin(a1);
        y1 = r1 * p.cos(a1);
        // ball 2
        // save the last position for trail
        lastPtsX.push(x2);
        lastPtsY.push(y2);
        // remove the oldest position from the trail array
        lastPtsX.shift();
        lastPtsY.shift();
        x2 = (x1 + (r2 * p.sin(a2)));
        y2 = (y1 + (r2 * p.cos(a2)));
    }
    function calcAngles() {
        if (dragging !== false) {
            a1_v = 0;
            a1_a = 0;
            a2_v = 0;
            a2_a = 0;
            return;
        }
        let num1, num2, num3, num4, den;
        //      −g   (2   m1 + m2)   sin θ1
        num1 = (-g * (2 * m1 + m2) * p.sin(a1));
        //      −m2   g   sin(θ1 − 2   θ2)
        num2 = (-m2 * g * p.sin(a1 - 2 * a2));
        //      −2   sin(θ1 − θ2)   m2
        num3 = (-2 * p.sin(a1 - a2) * m2);
        //      θ2'2          L2 + θ1'2          L1   cos(θ1 − θ2)
        num4 = (p.sq(a2_v) * r2 + p.sq(a1_v) * r1 * p.cos(a1 - a2));
        //     L1   (2   m1 + m2 − m2   cos(2   θ1 − 2   θ2))
        den = (r1 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)));
        a1_a = ((num1 + num2 + (num3 * num4)) / den);
        //      2   sin(θ1 − θ2)
        num1 = (2 * p.sin(a1 - a2));
        //      θ1'2          L1   (m1 + m2)
        num2 = (p.sq(a1_v) * r1 * (m1 + m2));
        //      g   (m1 + m2)   cos θ1
        num3 = (g * (m1 + m2) * p.cos(a1));
        //      θ2'2          L2   m2   cos(θ1 − θ2))
        num4 = (p.sq(a2_v) * r2 * m2 * p.cos(a1 - a2));
        //     L2   (2   m1 + m2 − m2   cos(2   θ1 − 2   θ2))
        den = (r2 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)));
        a2_a = ((num1 * (num2 + num3 + num4)) / den);
        // wrap acceleration to prevent drawing from breaking due to high speed
        a1_a %= (PI * 2);
        a2_a %= (PI * 2);
    }
    function applyForces() {
        // add acceleration to velocity
        a1_v += a1_a;
        a2_v += a2_a;
        // add velocity to pendulum angles
        a1 += a1_v;
        a2 += a2_v;
    }
    function dampenVelocities() {
        // soften velocity
        a1_v *= dampening;
        a2_v *= dampening;
    }
    function calcDraggedAngle() {
        if (false === dragging) {
            return;
        }
        if (dragging === 1) {
            // set angle1 to be from ball 1 starting point (center) to mouse position
            let delta_x = (p.mouseX - (p.width / 2));
            let delta_y = ((p.height / 2) - p.mouseY);
            a1 = p.atan2(delta_y, delta_x) + PI / 2;
        } else if (dragging === 2) {
            // set angle1 to be from ball 2 starting point (center + (x1, x2)) to mouse position
            let delta_x = (p.mouseX - ((p.width / 2) + x1));
            let delta_y = (((p.height / 2) + y1) - p.mouseY);
            a2 = p.atan2(delta_y, delta_x) + PI / 2;
        }
    }
    p.touchStarted = () => {
        // distance is from center since we translate to center of screen in draw()
        let mouseDeltaX = (p.mouseX - (p.width / 2));
        let mouseDeltaY = (p.mouseY - (p.height / 2));
        // check if we clicked on ball 1
        let dist1 = p.dist(x1, y1, mouseDeltaX, mouseDeltaY);
        // max distance is half of ball's line distance from ball
        let maxDist1 = (r1 / 2);
        if (dist1 <= maxDist1) {
            // dragging ball 1
            dragging = 1;
            calcDraggedAngle();
            return;
        }
        // check if we clicked on ball 2
        let dist2 = p.dist(x2, y2, mouseDeltaX, mouseDeltaY);
        let maxDist2 = (r2 / 2);
        if (dist2 <= maxDist2) {
            // dragging ball 2
            dragging = 2;
            // stop acceleration on a1 to prevent movement when dragging child ball
            a1_a = 0;
            calcDraggedAngle();
            return;
        }
        dragging = false;
        return;
    }
    p.touchMoved = ()=> {
        if (false === dragging) {
            // not dragging either ball
            return;
        }
        calcDraggedAngle();
    };
    p.touchEnded = ()=> {
        calcDraggedAngle();
        // reset dragging
        dragging = false;
    }
}
let dp = new p5(doublePendulum);
</script>

<h3>Talks</h3>
* [__Quantum Computing for Dummies!__](https://github.com/euler16/PyData-2018) : Presented at PyData-India Conference held in Delhi-11-12th August 2018.
* [__You Can Compress!__](https://github.com/euler16/PyData2017) : Presented as a co-speaker at PyData-India 2017. The talk was centered around popular dimensionality reduction methods used in Machine Learning.
<h3>Projects</h3>
* [__Qu.js__](https://github.com/euler16/Qu.js) : A JavaScript Quantum Computing framework that strives to be what Keras is for deep learning. Currently provides a local simulator, compilation to hardware specific Quantum languages (QUIL and QASM).
* [ __CharRNN__ ](https://github.com/euler16/CharRNN) : character based language modelling written in PyTorch.
* [ __Neural Style Transfer__ ](https://github.com/euler16/Neural-Style-Transfer) : implementation of the algorithm that is hallmark of interesection of art and AI.
* [ __Face-Recognizer__ ](https://github.com/euler16/Face-Recognizer) : Face Recognition using Principal Component Analysis.
<br>

<h3> Research Work </h3>

* Shrivastava, Nilay, et al. "MobiVSR: A Visual Speech Recognition Solution for Mobile Devices." arXiv preprint [arXiv:1905.03968 (2019)](https://arxiv.org/abs/1905.03968). Accepted for oral presentation at InterSpeech2019.

* Gupta, R., Shrivastava, N., Jain, M., Singh, V. and Rani, A., 2018, April. Greedy WOA for Travelling Salesman Problem. In International Conference on Advances in Computing and Data Sciences (pp. 321-330). Springer, Singapore.

