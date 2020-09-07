import {createElement, Text, Wraper} from './createElement';
// import {Carousel} from "./carousel.view"
const create = createElement;

class MyCompinent {
    constructor(config) {
        this.children = [];
        this.attributes = new Map();
    }

    setAttribute(name, value) { // attribute
        // this.attributes.set(name, value)
        this[name] = value;
        // this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    render() {
        let children = this.data.map((url) => {
            let element = <img src={url} />;
            element.addEventListener('dragstart',event => event.preventDefault());
            return element;
        })
        let root = <div class="carousel">
            {children}
        </div>

        let position = 0;
        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length;

            let current = children[position];
            let next = children[nextPosition];

            current.style.transition = 'ease 0s';
            next.style.transition = 'ease 0s';

            current.style.transform = `translateX(${- 100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

            setTimeout(function () {
                current.style.transition = '';
                next.style.transition = '';
                current.style.transform = `translateX(${-100 - 100 * position}%)`;
                next.style.transform = `translateX(${- 100 * nextPosition}%)`;
                position = nextPosition;
            }, 16)

            setTimeout(nextPic, 3000)
        }
        setTimeout(nextPic, 3000)
        
        return root;
    }

    mountTo(parent) {
        // this.slot = <div></div>;
        // for (let child of this.children) {
        //     this.slot.appendChild(child);
        // }
        this.render().mountTo(parent)
       
    }
}




// let component = <MyCompinent id="I'm is wang zhe "><div id="a" class="b"
//     style="width: 100px;height: 100px; background: red;">
//     <div >1</div>
//     <div >2</div>
//     <div >3</div>
// </div></MyCompinent>
let component = <MyCompinent data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />

// vue 风格代码。
// let component = <Carousel data={[
//     "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
//     "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
//     "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
//     "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
// ]} />
component.mountTo(document.body);

console.log(component);