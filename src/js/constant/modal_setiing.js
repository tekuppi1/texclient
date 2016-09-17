//import
import swiper_setiing from './swiper_setiing';

// モーダルの設定
export default {
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .6, // Opacity of modal background
    in_duration: 500, // Transition in duration
    out_duration: 500, // Transition out duration
    starting_top: '0%', // Starting top style attribute
    ending_top: '0%', // Ending top style attribute
    ready: () => {swiper_setiing()}, // Callback for Modal open
}
