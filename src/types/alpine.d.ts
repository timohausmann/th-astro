declare module "alpinejs" {
    interface AlpineData {
        $data: any;
        $el: HTMLElement;
    }

    interface Alpine {
        start: () => void;
    }

    const Alpine: Alpine;
    export default Alpine;
}

interface Window {
    Alpine: typeof Alpine;
}

interface HTMLElement {
    __x?: AlpineData;
}
