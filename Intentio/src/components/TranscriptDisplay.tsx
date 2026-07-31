/**
 * TranscriptDisplay — scrollable conversation history.
 * Shows user and agent messages in distinct bubble styles.
 */
import React, {useRef, useEffect} from 'react';
import {
  ScrollView,
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
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.agentText]}>
          {entry.text}
        </Text>
        <Text style={styles.timestamp}>{time}</Text>
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
        <Text style={styles.emptyEmoji}>💬</Text>
        <Text style={styles.emptyText}>Your conversation will appear here</Text>
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
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  agentRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  bubbleText: {
    fontSize: Typography.sizeBase,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textPrimary,
  },
  agentText: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: Typography.sizeXXS,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyEmoji: {
    fontSize: 40,
    opacity: 0.4,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.sizeSM,
  },
});
