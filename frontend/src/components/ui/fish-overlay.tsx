import { Button } from '@/components/ui/button';
import { Heart, Star, Target, Trophy, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Fish {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    direction: number;
    animationPhase: number;
    targetX: number;
    targetY: number;
    wanderTimer: number;
    targetDirection: number;
}

interface FishPellet {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
    createdAt: number;
}

interface FishOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const FISH_COUNT = 8;
const FISH_COLORS = [
    '#FFD700', // Gold
    '#FF6B6B', // Coral
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Mint
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Seafoam
];

export function FishOverlay({ isOpen, onClose }: FishOverlayProps) {
    const [fishes, setFishes] = useState<Fish[]>([]);
    const [pellets, setPellets] = useState<FishPellet[]>([]);
    const [isFeedModeActive, setIsFeedModeActive] = useState(false);
    const animationRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);
    const pelletIdCounter = useRef<number>(0);

    // Initialize fish with random positions and properties
    const initializeFishes = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const newFishes: Fish[] = [];

        for (let i = 0; i < FISH_COUNT; i++) {
            const initialDirection = Math.random() * Math.PI * 2;
            newFishes.push({
                id: i,
                x: Math.random() * (container.clientWidth - 100),
                y: Math.random() * (container.clientHeight - 100),
                vx: Math.cos(initialDirection) * 0.5,
                vy: Math.sin(initialDirection) * 0.5,
                size: 40 + Math.random() * 30,
                color: FISH_COLORS[i % FISH_COLORS.length],
                direction: initialDirection,
                animationPhase: Math.random() * Math.PI * 2,
                targetX: Math.random() * (container.clientWidth - 100),
                targetY: Math.random() * (container.clientHeight - 100),
                wanderTimer: Math.random() * 200 + 100,
                targetDirection: initialDirection,
            });
        }

        setFishes(newFishes);
    }, []);

    // Wandering algorithm for fish movement
    const updateFishPosition = useCallback((fish: Fish, containerWidth: number, containerHeight: number): Fish => {
        const newFish = { ...fish };

        // Update wander timer
        newFish.wanderTimer -= 1;

        // Change direction when wander timer expires
        if (newFish.wanderTimer <= 0) {
            // Select a new target near the old target
            const wanderRadius = 150;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * wanderRadius;

            newFish.targetX = newFish.targetX + Math.cos(angle) * distance;
            newFish.targetY = newFish.targetY + Math.sin(angle) * distance;

            // Keep target within bounds
            newFish.targetX = Math.max(0, Math.min(containerWidth - 100, newFish.targetX));
            newFish.targetY = Math.max(0, Math.min(containerHeight - 100, newFish.targetY));

            newFish.wanderTimer = Math.random() * 200 + 100;
        }

        // Calculate desired direction towards target
        const dx = newFish.targetX - newFish.x;
        const dy = newFish.targetY - newFish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            // Smoothly interpolate towards target direction
            const desiredDirection = Math.atan2(dy, dx);
            const directionDiff = desiredDirection - newFish.targetDirection;

            // Normalize angle difference to [-π, π]
            let normalizedDiff = directionDiff;
            while (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
            while (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;

            // Smoothly update target direction
            newFish.targetDirection += normalizedDiff * 0.008;

            // Calculate velocity based on target direction
            const speed = 0.3 + Math.random() * 0.2;
            newFish.vx = Math.cos(newFish.targetDirection) * speed;
            newFish.vy = Math.sin(newFish.targetDirection) * speed;
        } else {
            // Gentle random movement when near target
            newFish.vx += (Math.random() - 0.5) * 0.1;
            newFish.vy += (Math.random() - 0.5) * 0.1;

            // Limit maximum speed
            const currentSpeed = Math.sqrt(newFish.vx * newFish.vx + newFish.vy * newFish.vy);
            if (currentSpeed > 0.5) {
                newFish.vx = (newFish.vx / currentSpeed) * 0.5;
                newFish.vy = (newFish.vy / currentSpeed) * 0.5;
            }
        }

        // Update position
        newFish.x += newFish.vx;
        newFish.y += newFish.vy;

        // Keep fish within bounds with gentle bouncing
        if (newFish.x < 0 || newFish.x > containerWidth - 100) {
            newFish.vx *= -0.8;
            newFish.x = Math.max(0, Math.min(containerWidth - 100, newFish.x));
        }
        if (newFish.y < 0 || newFish.y > containerHeight - 100) {
            newFish.vy *= -0.8;
            newFish.y = Math.max(0, Math.min(containerHeight - 100, newFish.y));
        }

        // Update animation phase for accordion effect
        newFish.animationPhase += 0.1;

        return newFish;
    }, []);

    // Update pellet positions with physics
    const updatePelletPosition = useCallback((pellet: FishPellet, containerWidth: number, containerHeight: number): FishPellet | null => {
        const newPellet = { ...pellet };

        // Update position
        newPellet.x += newPellet.vx;
        newPellet.y += newPellet.vy;

        // Fade out over time (wait 3 seconds before starting to fade)
        const age = Date.now() - newPellet.createdAt;
        const fadeStartTime = 3000; // Wait 3 seconds before fading
        const fadeDuration = 2000; // Fade over 2 seconds after the wait

        if (age < fadeStartTime) {
            newPellet.opacity = 1; // Keep full opacity for first 3 seconds
        } else {
            const fadeProgress = (age - fadeStartTime) / fadeDuration;
            newPellet.opacity = Math.max(0, 1 - fadeProgress);
        }

        // Remove pellets that are off screen or fully faded
        if (newPellet.y > containerHeight + 50 || newPellet.x < -50 || newPellet.x > containerWidth + 50 || newPellet.opacity <= 0) {
            return null; // Mark for removal
        }

        return newPellet;
    }, []);

    // Animation loop
    const animate = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        setFishes(prevFishes =>
            prevFishes.map(fish => updateFishPosition(fish, container.clientWidth, container.clientHeight))
        );

        // Update pellets and remove expired ones
        setPellets(prevPellets => {
            const updatedPellets = prevPellets
                .map(pellet => updatePelletPosition(pellet, container.clientWidth, container.clientHeight))
                .filter((pellet): pellet is FishPellet => pellet !== null);
            return updatedPellets;
        });

        animationRef.current = requestAnimationFrame(animate);
    }, [updateFishPosition, updatePelletPosition]);

    // Handle overlay click (click-through) - don't close on transparent area clicks
    const handleOverlayClick = (e: React.MouseEvent) => {
        // Only close if clicking the close button or pressing escape
        // Transparent area clicks should pass through without closing
        if (e.target === e.currentTarget) {
            // If feed mode is active, create a pellet at click position
            if (isFeedModeActive && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const newPellet: FishPellet = {
                    id: pelletIdCounter.current++,
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 1, // Small horizontal drift
                    vy: 0.5 + Math.random() * 0.6, // Falling speed
                    opacity: 1,
                    createdAt: Date.now()
                };

                setPellets(prevPellets => [...prevPellets, newPellet]);
            }
            return;
        }
    };

    // Handle fish click
    const handleFishClick = (fishId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        // Add some interaction - make the fish "dance"
        setFishes(prevFishes =>
            prevFishes.map(fish =>
                fish.id === fishId
                    ? { ...fish, wanderTimer: 0, targetX: Math.random() * (containerRef.current?.clientWidth || 800), targetY: Math.random() * (containerRef.current?.clientHeight || 600) }
                    : fish
            )
        );
    };

    // Handle feed button click
    const handleFeedButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFeedModeActive(prev => !prev);
    };

    // Initialize and start animation when overlay opens
    useEffect(() => {
        if (isOpen) {
            initializeFishes();
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isOpen, initializeFishes, animate]);

    // Disable feed mode when overlay is closed and clear pellets
    useEffect(() => {
        if (!isOpen) {
            setIsFeedModeActive(false);
            setPellets([]); // Clear all pellets when overlay closes
        }
    }, [isOpen]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (isOpen && containerRef.current) {
                const container = containerRef.current;
                setFishes(prevFishes =>
                    prevFishes.map(fish => ({
                        ...fish,
                        x: Math.min(fish.x, container.clientWidth - 100),
                        y: Math.min(fish.y, container.clientHeight - 100),
                    }))
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[100] ${isFeedModeActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            onClick={handleOverlayClick}
        >
            {/* Animated Fish */}
            {fishes.map((fish) => {
                // Create accordion effect along the fish's body axis
                const accordionScale = 1 + Math.sin(fish.animationPhase) * 0.15;
                const accordionPerpendicular = 1 - Math.sin(fish.animationPhase) * 0.15;
                const rotation = fish.targetDirection * (180 / Math.PI);

                return (
                    <div
                        key={fish.id}
                        className="absolute cursor-pointer transition-all duration-100 pointer-events-auto"
                        style={{
                            left: fish.x,
                            top: fish.y,
                            transform: `rotate(${rotation}deg) scaleX(${accordionScale}) scaleY(${accordionPerpendicular})`,
                            transformOrigin: 'center',
                        }}
                        onClick={(e) => handleFishClick(fish.id, e)}
                    >
                        {/* Fish SVG */}
                        <svg
                            width={fish.size}
                            height={fish.size * 0.6}
                            viewBox="0 0 100 60"
                            className="drop-shadow-lg"
                        >
                            {/* Fish body */}
                            <ellipse
                                cx="50"
                                cy="30"
                                rx="35"
                                ry="20"
                                fill={fish.color}
                                opacity="0.9"
                            />
                            {/* Fish tail */}
                            <path
                                d="M15 30 Q5 20 5 30 Q5 40 15 30"
                                fill={fish.color}
                                opacity="0.8"
                            />
                            {/* Fish eye */}
                            <circle
                                cx="60"
                                cy="25"
                                r="6"
                                fill="white"
                            />
                            <circle
                                cx="62"
                                cy="23"
                                r="3"
                                fill="black"
                            />
                            {/* Fish fins */}
                            <ellipse
                                cx="45"
                                cy="15"
                                rx="8"
                                ry="4"
                                fill={fish.color}
                                opacity="0.7"
                            />
                            <ellipse
                                cx="45"
                                cy="45"
                                rx="8"
                                ry="4"
                                fill={fish.color}
                                opacity="0.7"
                            />
                            {/* Fish stripes */}
                            <ellipse
                                cx="40"
                                cy="30"
                                rx="15"
                                ry="3"
                                fill="rgba(255,255,255,0.3)"
                            />
                        </svg>
                    </div>
                );
            })}

            {/* Fish Pellets */}
            {pellets.map((pellet) => (
                <div
                    key={pellet.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: pellet.x - 10 / 2,
                        top: pellet.y - 10 / 2,
                        opacity: pellet.opacity,
                    }}
                >
                    <div
                        className="rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
                        style={{
                            width: 10,
                            height: 10,
                        }}
                    />
                </div>
            ))}

            {/* Dummy Buttons at Bottom */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 pointer-events-auto">
                <Button
                    variant="outline"
                    size="lg"
                    className={`bg-background/80 backdrop-blur-md border-2 transition-all duration-200 ${isFeedModeActive
                        ? 'scale-105 bg-primary/20 border-primary shadow-lg'
                        : 'hover:scale-105'
                        }`}
                    onClick={handleFeedButtonClick}
                >
                    <Heart className="w-5 h-5 mr-2" />
                    {isFeedModeActive ? 'Stop Feeding' : 'Feed Fish'}
                </Button>
            </div>

        </div>
    );
}
