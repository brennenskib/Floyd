const dat = JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) ? JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) : [];
FileLib.write("Floyd-main", "WorldEdit.json", JSON.stringify(dat), true);

register('packetSent', (packet, event) => {
    ChatLib.chat('test')
    let pos = new BlockPos(packet.func_179724_a());
    ChatLib.command('ct copy ' + `{ x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, blockType: ${World.getBlockAt(pos).type.getID()}, dir: ${packet.func_149568_f()} }`, true)
}).setPacketClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement)

let blocks = [
    { x: 56, y: 113, z: 111, blockType: 41, dir: 1 },
    { x: 55, y: 113, z: 111, blockType: 7 },
    { x: 55, y: 114, z: 111, blockType: 7 },
    { x: 56, y: 112, z: 110, blockType: 1 }
]

const JFrame = Java.type("javax.swing.JFrame");
const JPanel = Java.type("javax.swing.JPanel");
const JLabel = Java.type("javax.swing.JLabel");
const JButton = Java.type("javax.swing.JButton");
const BorderLayout = Java.type("java.awt.BorderLayout");
const Color = Java.type("java.awt.Color");
const Font = Java.type("java.awt.Font");
const BorderFactory = Java.type("javax.swing.BorderFactory");

// Function to create the GUI
function createGUI() {
    const frame = new JFrame("Black GUI Example");
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setSize(400, 300);
    frame.setLocationRelativeTo(null);

    const mainPanel = new JPanel();
    mainPanel.setBackground(Color.BLACK);
    mainPanel.setLayout(new BorderLayout());

    const titleLabel = new JLabel("Amazing Black GUI", JLabel.CENTER);
    titleLabel.setForeground(Color.WHITE);
    titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
    mainPanel.add(titleLabel, BorderLayout.NORTH);

    const actionButton = new JButton("Click Me");
    actionButton.setForeground(Color.WHITE);
    actionButton.setBackground(Color.DARK_GRAY);
    actionButton.setFocusPainted(false);
    actionButton.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));
    actionButton.setFont(new Font("Arial", Font.PLAIN, 16));
    mainPanel.add(actionButton, BorderLayout.CENTER);

    const footerLabel = new JLabel("Footer Text", JLabel.CENTER);
    footerLabel.setForeground(Color.GRAY);
    footerLabel.setFont(new Font("Arial", Font.ITALIC, 12));
    mainPanel.add(footerLabel, BorderLayout.SOUTH);

    frame.add(mainPanel);
    return frame;
}

const frame = createGUI();

function setVisible(isVisible) {
    frame.setVisible(isVisible);
}

setVisible(true); 