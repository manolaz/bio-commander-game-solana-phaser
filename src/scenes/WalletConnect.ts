import { Scene } from 'phaser';
import EventCenter from "@/events/eventCenter";
import { Umi } from "@metaplex-foundation/umi";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/components/Game';

export class WalletConnect extends Scene {
    private umi: Umi | undefined;

    constructor() {
        super('WalletConnect');
    }

    init() {
        console.log("WalletConnect init");
        // Tell the EventCenter that we are ready to receive events.
        EventCenter.emit("ready");
        // Listen for the "umi" event, which is emitted by the NextJS component when the user connects their wallet.
        EventCenter.on("umi", (umi: Umi) => {
            this.umi = umi;
        });
    }

    create() {
        // Create a gradient background instead of relying on sprite
        const background = this.add.graphics();
        background.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a);
        background.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        // Add some visual elements
        const gradient1 = this.add.graphics();
        gradient1.fillStyle(0x667eea, 0.1);
        gradient1.fillEllipse(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 4, 400, 200);

        const gradient2 = this.add.graphics();
        gradient2.fillStyle(0x9b59b6, 0.1);
        gradient2.fillEllipse(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.75, 300, 150);

        // Add wallet connection text
        this.add
            .text(
                DEFAULT_WIDTH / 2,
                DEFAULT_HEIGHT / 3,
                `🌌 Bio Commander`,
                { 
                    fontSize: "32px", 
                    fontFamily: "Arial Black", 
                    color: "#ffffff",
                    stroke: "#667eea",
                    strokeThickness: 4
                }
            )
            .setOrigin(0.5);

        this.add
            .text(
                DEFAULT_WIDTH / 2,
                DEFAULT_HEIGHT / 2,
                `Connect your wallet to play`,
                { 
                    fontSize: "20px", 
                    fontFamily: "Arial", 
                    color: "#ffffff",
                    align: "center" 
                }
            )
            .setOrigin(0.5);

        this.add
            .text(
                DEFAULT_WIDTH / 2,
                DEFAULT_HEIGHT * 0.6,
                `🦠 Defend the Human Body`,
                { 
                    fontSize: "16px", 
                    fontFamily: "Arial", 
                    color: "rgba(255, 255, 255, 0.7)",
                    align: "center" 
                }
            )
            .setOrigin(0.5);

        // Add loading animation
        const loadingText = this.add
            .text(
                DEFAULT_WIDTH / 2,
                DEFAULT_HEIGHT * 0.8,
                `Waiting for wallet connection...`,
                { 
                    fontSize: "14px", 
                    fontFamily: "Arial", 
                    color: "#9b59b6",
                    align: "center" 
                }
            )
            .setOrigin(0.5);

        // Add pulsing animation
        this.tweens.add({
            targets: loadingText,
            alpha: { from: 1, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update() {
        if (this.umi) {
            this.scene.start('MainMenu', { umi: this.umi });
        }
    }
}