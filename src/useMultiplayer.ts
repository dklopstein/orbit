import { useState, useEffect, useCallback, useRef } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import type { LocationKey, Player } from './constants';

export type ConnectionStatus = 'disconnected' | 'hosting' | 'joining' | 'connected' | 'error';

interface UseMultiplayerProps {
  onRemoteMove: (location: LocationKey) => void;
  onRemoteReset: () => void;
  setLocalPlayer: (player: Player | null) => void;
}

export const useMultiplayer = ({ onRemoteMove, onRemoteReset, setLocalPlayer }: UseMultiplayerProps) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const connRef = useRef<DataConnection | null>(null);

  const cleanup = useCallback(() => {
    if (connRef.current) {
      connRef.current.close();
    }
    if (peer) {
      peer.destroy();
    }
    setPeer(null);
    connRef.current = null;
    setStatus('disconnected');
    setLobbyCode('');
    setLocalPlayer(null);
  }, [peer, setLocalPlayer]);

  const setupConnection = useCallback((connection: DataConnection) => {
    connection.on('open', () => {
      connRef.current = connection;
      setStatus('connected');
    });

    connection.on('data', (data: any) => {
      if (typeof data !== 'object') return;
      
      if (data.type === 'MOVE') {
        onRemoteMove(data.location as LocationKey);
      } else if (data.type === 'RESET') {
        onRemoteReset();
      }
    });

    connection.on('close', () => {
      setStatus('disconnected');
      connRef.current = null;
      setLocalPlayer(null);
    });

    connection.on('error', (err) => {
      console.error('Connection error:', err);
      setError('Connection failed');
      setStatus('error');
    });
  }, [onRemoteMove, onRemoteReset, setLocalPlayer]);

  const hostLobby = useCallback(() => {
    cleanup();
    setStatus('hosting');
    
    // Generate a shorter ID for easier sharing (optional, PeerJS default is UUID-like)
    // For now, let's just let PeerJS generate one.
    const newPeer = new Peer();
    
    newPeer.on('open', (id) => {
      setPeer(newPeer);
      setLobbyCode(id);
    });

    newPeer.on('connection', (connection) => {
      setLocalPlayer('x'); // Host is always X
      setupConnection(connection);
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
      setError('Failed to initialize peer');
      setStatus('error');
    });
  }, [cleanup, setupConnection, setLocalPlayer]);

  const joinLobby = useCallback((code: string) => {
    cleanup();
    setStatus('joining');
    
    const newPeer = new Peer();
    
    newPeer.on('open', () => {
      setPeer(newPeer);
      const connection = newPeer.connect(code);
      setLocalPlayer('o'); // Guest is always O
      setupConnection(connection);
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
      setError('Failed to connect to lobby');
      setStatus('error');
    });
  }, [cleanup, setupConnection, setLocalPlayer]);

  const sendMove = useCallback((location: LocationKey) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'MOVE', location });
    }
  }, []);

  const sendReset = useCallback(() => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send({ type: 'RESET' });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (connRef.current) connRef.current.close();
      if (peer) peer.destroy();
    };
  }, [peer]);

  return {
    status,
    lobbyCode,
    error,
    hostLobby,
    joinLobby,
    sendMove,
    sendReset,
    disconnect: cleanup
  };
};
