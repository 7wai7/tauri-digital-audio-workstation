import "./NavPanel.css"

export default function NavPanel() {
    return (
        <nav className="navigation-panel-top">
            <NavButton title="Import"/>
            <NavButton title="Export"/>
        </nav>
    )
}

function NavButton({
    title
}: {
    title: string
}) {
    return (
        <button>
            {title}
        </button>
    )
}