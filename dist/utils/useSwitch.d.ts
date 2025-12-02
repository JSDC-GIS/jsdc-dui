type SwitchData = {
    id: string;
};
declare const useSwitch: <T extends SwitchData>(switchDatas: T[]) => {
    switchDatas: T[];
    activeData: T;
    activeId: string | undefined;
    switchById: (id: string | undefined) => void;
    forceSwitchActiveId: (id: string | undefined) => void;
};
export default useSwitch;
