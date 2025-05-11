import videojs from 'video.js';

declare global {
    interface VideoJsPlayer extends videojs.Player {
        fill: (fill: boolean) => void;
        isDisposed: () => boolean;
        autoplay: (autoplay: boolean) => void;
        src: (sources: Array<{
            src: string;
            type: string;
        }>) => void;
        dispose: () => void;
        currentTime(arg0?: number | string);
        on(arg0: string, arg1: () => void);
    }

    interface VideoJSOptions extends videojs.PlayerOptions {
        autoplay?: boolean;
        sources: Array<{
            src: string;
            type: string;
        }>;
    }
}