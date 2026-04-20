import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./NavPanel.css"
import { useGlobalStore } from "../../stores/store";

export default function NavPanel() {
    const addClip = useGlobalStore(s => s.addClip);

    const handleImport = async () => {
        const path = await open({
            multiple: false,
            filters: [{ name: "Audio", extensions: ["mp3", "wav"] }]
        });

        if(path) {
            const data: Clip = await invoke("import_audio", { path });
            addClip(data)
        }
    };

    return (
        <nav className="navigation-panel-top">
            <NavButton title="Import" onClick={handleImport} />
            <NavButton title="Export" />
        </nav>
    )
}

function NavButton({
    title,
    onClick
}: {
    title: string,
    onClick?: () => void
}) {
    return (
        <button onClick={onClick}>
            {title}
        </button>
    )
}