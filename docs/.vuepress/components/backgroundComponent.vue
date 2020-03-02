<template>
    <div class="page-container page1">
        <div class="animation-cont">
            <div class="ani-1">
                <img
                    src="../public/img/part1.png"
                    alt=""
                    class="part part1"
                />
                <img
                    src="../public/img/part2.png"
                    alt=""
                    class="part part2"
                    width="25"
                />
                <img
                    src="../public/img/part3.png"
                    alt=""
                    class="part part3"
                    width="41"
                />
                <img
                    src="../public/img/part4.png"
                    alt=""
                    class="part part4"
                    width="32"
                />
                <img
                    src="../public/img/part5.png"
                    alt=""
                    class="part part5"
                    width="35"
                />
                <img
                    src="../public/img/part6.png"
                    alt=""
                    class="part part6"
                    width="65"
                />
                <img
                    src="../public/img/part7.png"
                    alt=""
                    class="part part7"
                    width="50"
                />
                <img
                    src="../public/img/part8.png"
                    alt=""
                    class="part part8"
                    width="35"
                />
            </div>
        </div>
    </div>
</template>
<script>
import { TweenMax } from "gsap";
export default {
    props: {},
    data() {
        return {
            mousemoveIsActive: false
        };
    },
    mounted() {
        let container = document.querySelector(".animation-cont");
        // 父元素设置perspective
        let ani = document.querySelector(".ani-1");
        TweenMax.set(container, { perspective: 1000 });
        TweenMax.from(ani, 1.3, {
            z: "-1000px",
            scale: 0.1,
            autoAlpha: 0,
            ease: Back.easeOut.config(1.7)
        });
        // TweenMax.from(ani, 1.8, {z: '-1000px', autoAlpha: 0,ease:Back.easeOut}).repeat(1).yoyo(true).repeatDelay(0.5);

        this.addMousemove();
        this.GASP();
    },
    beforeDestroy() {
        this.removeMousemove();
    },
    methods: {
        GASP() {
            let part1 = document.querySelector(".part1");
            let part2 = document.querySelector(".part2");
            let part3 = document.querySelector(".part3");
            let part4 = document.querySelector(".part4");
            let part5 = document.querySelector(".part5");
            let part6 = document.querySelector(".part6");
            let part7 = document.querySelector(".part7");
            let part8 = document.querySelector(".part8");
            let light = document.querySelector(".light-img");
            // TweenMax.from(part1,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part2,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part3,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part4,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part5,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part6,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part7,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            // TweenMax.from(part8,3,{top:'50%',left:'50%',autoAlpha: 0,force3D:true,ease:Power4.easeOut})
            TweenMax.staggerFrom(document.querySelectorAll(".part"), 2, {
                top: "50%",
                left: "50%",
                autoAlpha: 0,
                force3D: true,
                rotation: "720deg"
            });

            TweenMax.to(part1, 4, {
                y: "-=30px",
                scale: 0.8,
                ease: Power0.easeNone,
                yoyo: true
            }).repeat(-1);

            TweenMax.fromTo(
                part2,
                4,
                { y: "+=50px", x: "-=50px", scale: 0.8 },
                {
                    y: "-=50px",
                    x: "+=50px",
                    scale: 1.0,
                    autoAlpha: 0.3,
                    ease: Power0.easeNone,
                    yoyo: true,
                    delay: 2
                }
            ).repeat(-1);

            TweenMax.fromTo(
                part3,
                4,
                { y: "+=50px", x: "+=70px", scale: 0.8 },
                {
                    y: "-=50px",
                    x: "-=70px",
                    scale: 1.0,
                    autoAlpha: 0.6,
                    ease: Power0.easeNone,
                    yoyo: true,
                    delay: 1
                }
            ).repeat(-1);

            TweenMax.fromTo(
                part4,
                5,
                { y: "-=50px", x: "+=80px", scale: 0.8 },
                {
                    y: "+=50px",
                    x: "-=70px",
                    scale: 1.0,
                    z: "100px",
                    ease: Power0.easeNone,
                    yoyo: true,
                    delay: 1
                }
            ).repeat(-1);
            // right
            TweenMax.fromTo(
                part5,
                5,
                { y: "-=50px", x: "+=80px", scale: 0.8 },
                {
                    y: "+=50px",
                    x: "-=70px",
                    scale: 1.0,
                    ease: Power0.easeNone,
                    yoyo: true
                }
            ).repeat(-1);

            TweenMax.fromTo(
                part6,
                5,
                { y: "-=50px", x: "-=70px", scale: 1.0 },
                {
                    y: "+=50px",
                    x: "+=70px",
                    scale: 0.8,
                    z: "100px",
                    autoAlpha: 0.6,
                    ease: Power0.easeNone,
                    yoyo: true,
                    delay: 1
                }
            ).repeat(-1);

            TweenMax.fromTo(
                part7,
                5,
                { y: "+=50px", x: "+=80px", scale: 0.8 },
                {
                    y: "-=50px",
                    x: "-=70px",
                    scale: 1.0,
                    ease: Power0.easeNone,
                    yoyo: true,
                    delay: 2
                }
            ).repeat(-1);

            TweenMax.fromTo(
                part8,
                5,
                { y: "-=50px", x: "+=80px", scale: 0.8 },
                {
                    y: "+=50px",
                    x: "-=70px",
                    scale: 1.0,
                    z: "100px",
                    ease: Power0.easeNone,
                    yoyo: true,
                    delay: 0
                }
            ).repeat(-1);
            light &&
                TweenMax.fromTo(
                    light,
                    1.8,
                    { scale: 0.8 },
                    {
                        scale: 1.0,
                        z: "100px",
                        ease: Power0.easeNone,
                        yoyo: true,
                        delay: 0
                    }
                ).repeat(-1);
        },
        mousemove(e) {
            e.preventDefault();

            let centorX = e.clientX - window.innerWidth / 2;
            // let centorY = window.innerHeight / 2 - (e.clientY + 100)
            let centorY = window.innerHeight / 2 - e.clientY;
            let ani = document.querySelector(".ani-1");
            let degX = centorX * 0.01;
            let degY = centorY * 0.02;
            //子元素动画
            TweenMax.killTweensOf(ani, false, {
                rotationX: true,
                rotationY: true
            });
            TweenMax.to(ani, 0.8, { rotationX: degX });
            TweenMax.to(ani, 0.8, { rotationY: degY });
        },
        addMousemove() {
            !this.mousemoveIsActive
                ? window.addEventListener("mousemove", this.mousemove)
                : undefined;
            this.mousemoveIsActive = true;
        },
        removeMousemove() {
            this.mousemoveIsActive = false;
            window.removeEventListener("mousemove", this.mousemove);
        },
        gradual(e) {
            const x = e.pageX - e.target.offsetLeft;
            const y = e.pageY - e.target.offsetTop;

            e.target.style.setProperty("--x", `${x}px`);
            e.target.style.setProperty("--y", `${y}px`);
        }
    }
};
</script>

<style lang="less" scoped>
.page-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    min-height: 98vh;
    height: 100%;
    background-color: #1b1333;
    overflow: hidden;
    .animation-cont {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        .ani-1 {
            position: absolute;
            top: 0px;
            bottom: 0px;
            width: 100%;
            min-width: 980px;
            background: url(../public/img/main-bj.png) no-repeat;
            background-size: 100% auto;

            img {
                position: absolute;
            }
        }
    }
}

.part1 {
    left: 230px;
    top: 35px;
}
.part2 {
    left: 35px;
    top: 120px;
}
.part3 {
    left: 125px;
    top: 320px;
}
.part4 {
    left: 350px;
    top: 520px;
}
.part5 {
    right: 280px;
    top: 140px;
}
.part6 {
    right: 210px;
    top: 400px;
}
.part7 {
    right: 20px;
    top: 575px;
}
.part8 {
    right: 450px;
    top: 500px;
}
</style>
