const settings = {
    category1: {
        subcategory1: { type: "toggleable", value: true },
        subcategory2: { type: "slider", value: 50, min: 0, max: 100 },
        subcategory3: { type: "key set", value: "A" }
    },
    category2: {
        subcategory1: { type: "text set", value: "Hello" },
        subcategory2: { 
            type: "dropdown", 
            value: "Option 1", 
            options: ["Option 1", "Option 2", "Option 3"] 
        }
    }
};

const JFrame = Java.type("javax.swing.JFrame");
const JPanel = Java.type("javax.swing.JPanel");
const JLabel = Java.type("javax.swing.JLabel");
const JButton = Java.type("javax.swing.JButton");
const JTextField = Java.type("javax.swing.JTextField");
const JSlider = Java.type("javax.swing.JSlider");
const JComboBox = Java.type("javax.swing.JComboBox");
const JCheckBox = Java.type("javax.swing.JCheckBox");
const BorderLayout = Java.type("java.awt.BorderLayout");
const BoxLayout = Java.type("javax.swing.BoxLayout");
const Color = Java.type("java.awt.Color");
const Dimension = Java.type("java.awt.Dimension");
const Font = Java.type("java.awt.Font");

function setButtonStyle(button) {
    button.setFont(new Font("Segoe UI", Font.PLAIN, 14));
    button.setBackground(new Color(50 / 255, 50 / 255, 50 / 255)); // Normalize by dividing by 255
    button.setForeground(Color.WHITE);
    button.setBorder(BorderFactory.createRoundRectBorder(20, new Color(169 / 255, 169 / 255, 169 / 255))); // Dark gray border
}

function setTextFieldStyle(textField) {
    textField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
    textField.setBackground(new Color(60 / 255, 60 / 255, 60 / 255)); // Normalize by dividing by 255
    textField.setForeground(Color.WHITE);
    textField.setBorder(BorderFactory.createRoundRectBorder(20, new Color(169 / 255, 169 / 255, 169 / 255))); // Dark gray border
}

function setSliderStyle(slider) {
    slider.setBackground(new Color(60 / 255, 60 / 255, 60 / 255)); // Normalize by dividing by 255
    slider.setForeground(Color.WHITE);
    slider.setMajorTickSpacing(10);
    slider.setMinorTickSpacing(1);
    slider.setPaintTicks(true);
    slider.setPaintLabels(true);
    slider.setBorder(BorderFactory.createRoundRectBorder(20, new Color(169 / 255, 169 / 255, 169 / 255))); // Dark gray border
}

function setComboBoxStyle(comboBox) {
    comboBox.setFont(new Font("Segoe UI", Font.PLAIN, 14));
    comboBox.setBackground(new Color(60 / 255, 60 / 255, 60 / 255)); // Normalize by dividing by 255
    comboBox.setForeground(Color.WHITE);
    comboBox.setBorder(BorderFactory.createRoundRectBorder(20, new Color(169 / 255, 169 / 255, 169 / 255))); // Dark gray border
}

function createGUIFromSettings(settings) {
    const frame = new JFrame("Dynamic Settings GUI");
    frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
    frame.setSize(500, 400);
    frame.setLocationRelativeTo(null);
    
    const mainPanel = new JPanel();
    mainPanel.setLayout(new BoxLayout(mainPanel, BoxLayout.Y_AXIS));
    mainPanel.setBackground(new Color(0 / 255, 0 / 255, 0 / 255)); // Normalize black color

    // Iterate over each category in the settings
    for (let category in settings) {
        const categoryPanel = new JPanel();
        categoryPanel.setLayout(new BoxLayout(categoryPanel, BoxLayout.Y_AXIS));
        categoryPanel.setBackground(new Color(43 / 255, 43 / 255, 43 / 255)); // Dark gray panel background
        categoryPanel.setMaximumSize(new Dimension(480, 100));
        
        const categoryLabel = new JLabel(category);
        categoryLabel.setForeground(Color.WHITE);
        categoryLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        categoryPanel.add(categoryLabel);
        
        const subSettings = settings[category];
        for (let subCategory in subSettings) {
            const setting = subSettings[subCategory];
            const subPanel = new JPanel();
            subPanel.setBackground(new Color(169 / 255, 169 / 255, 169 / 255)); // Normalized gray color for subpanels
            subPanel.setMaximumSize(new Dimension(480, 40));
            
            const subLabel = new JLabel(subCategory);
            subLabel.setForeground(Color.BLACK);
            subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            subPanel.add(subLabel);
            
            // Create controls based on the type
            switch (setting.type) {
                case "toggleable":
                    const toggleButton = new JButton(setting.value ? "Enabled" : "Disabled");
                    setButtonStyle(toggleButton);
                    toggleButton.addActionListener(() => {
                        setting.value = !setting.value;
                        toggleButton.setText(setting.value ? "Enabled" : "Disabled");
                        toggleButton.setBackground(setting.value ? Color.GREEN : Color.RED);
                    });
                    subPanel.add(toggleButton);
                    break;
                
                case "slider":
                    const slider = new JSlider(setting.min, setting.max, setting.value);
                    setSliderStyle(slider);
                    slider.addChangeListener(() => {
                        setting.value = slider.getValue();
                    });
                    subPanel.add(slider);
                    break;

                case "key set":
                    const keyField = new JTextField(setting.value, 5);
                    setTextFieldStyle(keyField);
                    keyField.addActionListener(() => {
                        setting.value = keyField.getText();
                    });
                    subPanel.add(keyField);
                    break;
                    
                case "text set":
                    const textField = new JTextField(setting.value, 10);
                    setTextFieldStyle(textField);
                    textField.addActionListener(() => {
                        setting.value = textField.getText();
                    });
                    subPanel.add(textField);
                    break;

                case "dropdown":
                    const StringArray = Java.type("java.lang.String");
                    const optionsArray = new Array(setting.options.length);
                    for (let i = 0; i < setting.options.length; i++) {
                        optionsArray[i] = new StringArray(setting.options[i]);
                    }
                    const comboBox = new JComboBox(optionsArray);
                    setComboBoxStyle(comboBox);
                    comboBox.setSelectedItem(setting.value);
                    comboBox.addActionListener(() => {
                        setting.value = comboBox.getSelectedItem();
                    });
                    subPanel.add(comboBox);
                    break;
            }
            
            categoryPanel.add(subPanel);
        }
        
        mainPanel.add(categoryPanel);
    }
    
    frame.add(mainPanel);
    frame.setVisible(true);
}

// Example usage
createGUIFromSettings(settings);
