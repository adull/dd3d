import { getCurrentCamPos, updateSavedCamPos } from '../helpers/index'

const CameraHelperButtons = ({ enabled, camRef }) => {
    const enabledMap = {
        getCurrentCamPos: (enabled && enabled.constructor === Array) ? enabled.includes('getCurrentCamPos') : false,
        updateSavedCamPos: (enabled && enabled.constructor === Array) ? enabled.includes('updateSavedCamPos') : false
    }
    
    return (
        <div className="flex flex-col z-1">
            {enabledMap.getCurrentCamPos ? <Button onClick={(e) => {e.preventDefault(); getCurrentCamPos(camRef)} }>Get current camera position</Button> : <></>}
            {enabledMap.updateSavedCamPos ? <Button onClick={(e) => {e.preventDefault(); updateSavedCamPos(camRef) }}>Update camera position</Button> : <></> }
        </div>  
    );
}

const Button = ({onClick, children}) => (
    <button onClick={onClick} className="flex mt-2 flex-start items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-slate-800 border-slate-800 text-slate-50 hover:bg-slate-700 hover:border-slate-700">
        {children}
    </button>
)

export default CameraHelperButtons;
