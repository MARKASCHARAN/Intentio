/**
 * TranscriptDisplay — Million-Dollar Glassmorphic Chat Display
 */
import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Colors, Typography, Spacing, Radius} from './styles';
import type {TranscriptEntry} from '../types/agent';

interface TranscriptDisplayProps {
  entries: TranscriptEntry[];
}

function TranscriptBubble({entry}: {entry: TranscriptEntry}): React.JSX.Element {
  const isUser = entry.role === 'user';
  const time = new Date(entry.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.bubbleRow, isUser ? styles.userRow : styles.agentRow]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.agentBubble,
        ]}>
        {!isUser && (
          <View style={styles.agentHeader}>
            <Text style={styles.agentBadgeIcon}>🎯</Text>
            <Text style={styles.agentBadgeName}>Intentio</Text>
          </View>
        )}
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.agentText]}>
          {entry.text}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.agentTimestamp]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

export function TranscriptDisplay({
  entries,
}: TranscriptDisplayProps): React.JSX.Element {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (entries.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.radarRing}>
          <Text style={styles.emptyEmoji}>🎙️</Text>
        </View>
        <Text style={styles.emptyTitle}>Listening for your intent...</Text>
        <Text style={styles.emptyText}>Speak naturally — "Book a flight to London for tomorrow"</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={entries}
      keyExtractor={item => item.id}
      renderItem={({item}) => <TranscriptBubble entry={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  agentRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
    gap: 4,
  },
  userBubble: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    borderBottomRightRadius: 4,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  agentBubble: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  agentBadgeIcon: {
    fontSize: 12,
  },
  agentBadgeName: {
    fontSize: Typography.sizeXXS,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bubbleText: {
    fontSize: Typography.sizeBase - 1,
    lineHeight: 22,
    fontWeight: '400',
  },
  userText: {
    color: Colors.textPrimary,
  },
  agentText: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: Typography.sizeXXS,
    marginTop: 2,
  },
  userTimestamp: {
    color: 'rgba(0, 242, 254, 0.7)',
    alignSelf: 'flex-end',
  },
  agentTimestamp: {
    color: Colors.textMuted,
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  radarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptyEmoji: {
    fontSize: 28,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizeBase,
    fontWeight: '600',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.sizeXS,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
