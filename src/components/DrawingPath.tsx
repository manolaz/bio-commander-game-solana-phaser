import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface DrawingPathProps {
  isDrawing: boolean;
  points: TouchPoint[];
}

/**
 * Drawing Path Visualization Component
 * Renders the user's touch path during shape drawing
 * Features gradient opacity for visual trail effect
 */
export const DrawingPath: React.FC<DrawingPathProps> = ({
  isDrawing,
  points,
}) => {
  if (!isDrawing || points.length < 2) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {points.map((point, index) => {
        const opacity = 1 - (index / points.length) * 0.7;
        const scale = 0.5 + (index / points.length) * 0.5;
        
        return (
          <View
            key={`${point.x}-${point.y}-${index}`}
            style={[
              styles.drawPoint,
              {
                left: point.x - 3,
                top: point.y - 3,
                opacity,
                transform: [{ scale }],
              }
            ]}
          />
        );
      })}
      
      {/* Connection lines between points */}
      {points.length > 1 && points.map((point, index) => {
        if (index === 0) return null;
        
        const prevPoint = points[index - 1];
        const distance = Math.sqrt(
          Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
        );
        const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
        
        return (
          <View
            key={`line-${index}`}
            style={[
              styles.connectionLine,
              {
                left: prevPoint.x,
                top: prevPoint.y - 1,
                width: distance,
                transform: [{ rotate: `${angle}rad` }],
                opacity: 1 - (index / points.length) * 0.5,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  drawPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#f39c12',
    borderRadius: 4,
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  connectionLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(243, 156, 18, 0.6)',
    borderRadius: 1,
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
});