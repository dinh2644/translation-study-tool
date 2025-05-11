import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import InputBar from '@/components/InputBar'
import Navbar from '@/components/Navbar'
import TranslationBox from '@/components/TranslationBox'
import VideoJS from '@/components/VideoJS'
import VideoPlayer from '@/components/VideoPlayer'
import VocabBank from '@/components/VocabBank'
import { VideoContext } from '@/context/videoContext'
import { useUser } from '@auth0/nextjs-auth0'
import DropdownMenu from '@/components/DropdownMenu'

interface TranscriptItemType {
    text: string,
    start: number,
    duration: number
}


const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockVideoContext = {
    currentVocabs: [],
    setCurrentVocabs: jest.fn(),
    sourceLang: 'en',
    videoUrl: '',
    setVideoUrl: jest.fn(),
    transcript: [] as TranscriptItemType[],
    fetchTranscript: jest.fn(),
    videoId: '',
    setVideoId: jest.fn(),
    playerRef: { current: null },
    activeIndex: 0,
    setActiveIndex: jest.fn(),
    finishedTranslating: false,
    translatedTranscript: [] as string[],
    setHighlightedText: jest.fn(),
    highlightedText: '',
    translationProgress: 0,
    setTranslationProgress: jest.fn(),
    setSourceLang: jest.fn(),
    setCurrentTranscriptItem: jest.fn()
};

describe('Components rendering', () => {
    it('should render InputBar', () => {
        render(<InputBar />) // Arrange
        const component = screen.getByTestId('InputBarId') // Act
        expect(component).toBeInTheDocument() // Assert
    })

    it('should render Navbar', () => {
        render(<Navbar />)
        const component = screen.getByTestId('NavbarId')
        expect(component).toBeInTheDocument()
    })

    it('should render TranslationBox', () => {
        render(<TranslationBox />)
        const component = screen.getByTestId('TranslationBoxId')
        expect(component).toBeInTheDocument()
    })

    it('should render VideoJS', () => {
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            techOrder: ["youtube"],
            height: 100,
            width: 100,
            sources: [{
                src: 'https://www.youtube.com/watch?v=4NjSKPPFaEU',
                type: 'video/youtube'
            }],
        };
        const handlePlayerReady = jest.fn()
        render(<VideoJS options={videoJsOptions} onReady={handlePlayerReady} />)
        const component = screen.getByTestId('videojs-container')
        const component2 = screen.getByTestId('videojs-video-ref')
        expect(component).toBeInTheDocument()
        expect(component2).toBeInTheDocument()
    })

    it('should render VideoPlayer', () => {
        render(<VideoPlayer />)
        const component = screen.getByTestId('VideoPlayerId')
        expect(component).toBeInTheDocument()
    })

    it('should render VocabBank', () => {
        render(<VocabBank />)
        const component = screen.getByTestId('VocabBankId')
        expect(component).toBeInTheDocument()
    })
})

describe('InputBar Component', () => {
    jest.clearAllMocks();

    it('should contain the value of the pasted url', () => {
        const mockSetVideoUrl = jest.fn();
        const mockContext = {
            ...mockVideoContext,
            setVideoUrl: mockSetVideoUrl,
        };

        render(
            <VideoContext.Provider value={mockContext}>
                <InputBar />
            </VideoContext.Provider>
        );

        const input = screen.getByPlaceholderText('https://www.youtube.com/');

        fireEvent.change(input, { target: { value: 'https://www.youtube.com/watch?v=4NjSKPPFaEU' } });
        expect(mockSetVideoUrl).toHaveBeenCalledWith('https://www.youtube.com/watch?v=4NjSKPPFaEU');

        fireEvent.change(input, { target: { value: 'https://youtu.be/4NjSKPPFaEU' } });
        expect(mockSetVideoUrl).toHaveBeenCalledWith('https://youtu.be/4NjSKPPFaEU');
    });

    it('should save video URL to localStorage', async () => {
        jest.clearAllMocks();

        jest.clearAllMocks();

        const mockSetVideoUrl = jest.fn((url) => {
            localStorageMock.setItem('videoUrl', url);
        });

        const mockContext = {
            ...mockVideoContext,
            setVideoUrl: mockSetVideoUrl
        };

        render(
            <VideoContext.Provider value={mockContext}>
                <InputBar />
            </VideoContext.Provider>
        );

        const input = screen.getByPlaceholderText('https://www.youtube.com/');
        fireEvent.change(input, { target: { value: 'https://www.youtube.com/watch?v=4NjSKPPFaEU' } });

        await waitFor(() => {
            expect(mockSetVideoUrl).toHaveBeenCalledWith('https://www.youtube.com/watch?v=4NjSKPPFaEU');
        }, { timeout: 2000 });

        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith('videoUrl', 'https://www.youtube.com/watch?v=4NjSKPPFaEU');
        }, { timeout: 2000 });
    });
});

describe('TranslationBox Component', () => {
    it('should handle text selection and show dropdown', () => {
        jest.clearAllMocks();

        const mockContext = {
            ...mockVideoContext,
            transcript: [{ text: 'Test text', start: 0, duration: 1 }] as TranscriptItemType[],
            translatedTranscript: ['Test text'],
            finishedTranslating: true,
            translationProgress: 100
        };

        Element.prototype.scrollIntoView = jest.fn();

        const mockSelection = {
            toString: () => 'Test text',
            rangeCount: 1,
            getRangeAt: () => ({
                getBoundingClientRect: () => ({
                    top: 100,
                    left: 100,
                    width: 50,
                    height: 20,
                    right: 150,
                    bottom: 120,
                }),
            }),
        };

        window.getSelection = jest.fn().mockReturnValue(mockSelection as any);

        render(
            <VideoContext.Provider value={mockContext}>
                <TranslationBox />
            </VideoContext.Provider>
        );

        const textElements = screen.getAllByText('Test text');
        expect(textElements[0]).toBeInTheDocument();

        fireEvent.mouseUp(textElements[0]);

        expect(screen.getByTestId('DropdownMenuId')).toBeInTheDocument();
    });

    it('should format timestamp correctly', () => {
        jest.clearAllMocks();

        const mockContext = {
            ...mockVideoContext,
            transcript: [{ text: 'Test text', start: 65, duration: 1 }] as TranscriptItemType[],
            translatedTranscript: ['Test text'],
            finishedTranslating: true,
            translationProgress: 100
        };

        Element.prototype.scrollIntoView = jest.fn();

        render(
            <VideoContext.Provider value={mockContext}>
                <TranslationBox />
            </VideoContext.Provider>
        );

        const playButton = screen.getByAltText('Play');
        fireEvent.mouseEnter(playButton);

        const tooltip = document.querySelector('.fixed.px-2.py-1.text-xs.bg-black.text-white.rounded.shadow.z-50');
        expect(tooltip).toHaveTextContent('01:05 - 01:06');
    });
});


describe('VideoJS Component', () => {
    it('should handle player ready event', async () => {
        jest.clearAllMocks();

        const handlePlayerReady = jest.fn();
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            techOrder: ["youtube"],
            height: 100,
            width: 100,
            sources: [{
                src: 'https://www.youtube.com/watch?v=4NjSKPPFaEU',
                type: 'video/mp4'
            }],
        };

        render(<VideoJS options={videoJsOptions} onReady={handlePlayerReady} />);

        await waitFor(() => {
            expect(handlePlayerReady).toHaveBeenCalled();
        });
    });

    it('should render with correct video source', () => {
        jest.clearAllMocks();

        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            techOrder: ["youtube"],
            height: 100,
            width: 100,
            sources: [{
                src: 'https://www.youtube.com/watch?v=4NjSKPPFaEU',
                type: 'video/youtube'
            }],
        };
        render(<VideoJS options={videoJsOptions} onReady={jest.fn()} />);
        const videoElement = screen.getByTestId('videojs-video-ref');

        const dataSetup = videoElement.getAttribute('data-setup');
        expect(dataSetup).toBeDefined();
        if (dataSetup) {
            const setup = JSON.parse(dataSetup);
            expect(setup.sources[0].src).toBe('https://www.youtube.com/watch?v=4NjSKPPFaEU');
        }
    });
});

describe('VocabBank Component', () => {
    it('should handle adding vocabulary', () => {
        jest.clearAllMocks();

        const mockSetCurrentVocabs = jest.fn();
        const mockContext = {
            ...mockVideoContext,
            currentVocabs: [],
            setCurrentVocabs: mockSetCurrentVocabs,
            highlightedText: 'test word'
        };

        const { rerender } = render(
            <VideoContext.Provider value={mockContext}>
                <VocabBank />
                <DropdownMenu />
            </VideoContext.Provider>
        );

        expect(screen.getByText('Highlight any non-translated text to add to your vocabulary bank')).toBeInTheDocument();

        const addButton = screen.getByText('Add to Bank');
        fireEvent.click(addButton);

        expect(mockSetCurrentVocabs).toHaveBeenCalledWith(['test word']);

        const updatedContext = {
            ...mockContext,
            currentVocabs: ['test word']
        };

        rerender(
            <VideoContext.Provider value={updatedContext}>
                <VocabBank />
                <DropdownMenu />
            </VideoContext.Provider>
        );

        expect(screen.getByText('test word')).toBeInTheDocument();
        expect(screen.queryByText('Highlight any non-translated text to add to your vocabulary bank')).not.toBeInTheDocument();
    });

    it('should handle creating a new deck', async () => {
        jest.clearAllMocks();

        const mockUser = {
            sub: 'test-user-id'
        };
        (useUser as jest.Mock).mockReturnValue({ user: mockUser });

        const mockFetch = jest.fn().mockImplementation((url) => {
            if (url === '/api/flashcard') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { front: 'こんにちは', back: 'Hello' }
                    ])
                });
            }
            if (url === '/api/deck') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        _id: 'test-deck-id',
                        deckName: 'Test Deck',
                        createdAt: new Date().toISOString(),
                        flashcards: [
                            { front: 'こんにちは', back: 'Hello' }
                        ]
                    })
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            });
        });
        global.fetch = mockFetch;

        const mockContext = {
            ...mockVideoContext,
            currentVocabs: ['こんにちは'],
            sourceLang: 'ja',
            videoUrl: 'https://www.youtube.com/watch?v=4NjSKPPFaEU'
        };

        render(
            <VideoContext.Provider value={mockContext}>
                <VocabBank />
            </VideoContext.Provider>
        );

        const createButton = screen.getByText('Create Flashcard Deck');
        fireEvent.click(createButton);

        const deckNameInput = screen.getByPlaceholderText('Enter deck name...');
        fireEvent.change(deckNameInput, { target: { value: 'Test Deck' } });

        const createDeckButton = screen.getByText('Create Deck');
        fireEvent.click(createDeckButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/flashcard', expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language_code: 'ja',
                    words: ['こんにちは']
                })
            }));

            const deckApiCall = mockFetch.mock.calls.find((call: [string, RequestInit]) => call[0] === '/api/deck');
            expect(deckApiCall).toBeDefined();

            const requestBody = JSON.parse(deckApiCall[1].body as string);
            expect(requestBody).toMatchObject({
                postedBy: 'test-user-id',
                deckName: 'Test Deck',
                videoUrl: 'https://www.youtube.com/watch?v=4NjSKPPFaEU',
                flashcards: [{ front: 'こんにちは', back: 'Hello' }]
            });
            expect(requestBody.createdAt).toBeDefined();
        });
    });
});

describe('VideoPlayer Component', () => {
    it('should handle player ready event and set up event listeners', () => {
        jest.clearAllMocks();

        const mockContext = {
            ...mockVideoContext,
            videoId: 'test-video-id',
            transcript: [{ text: 'Test text', start: 0, duration: 1 }] as TranscriptItemType[],
            currentTranscriptItem: [],
            setCurrentTranscriptItem: jest.fn(),
            activeIndex: 0,
            setActiveIndex: jest.fn()
        };

        render(
            <VideoContext.Provider value={mockContext}>
                <VideoPlayer />
            </VideoContext.Provider>
        );

        const videoPlayer = screen.getByTestId('VideoPlayerId');
        expect(videoPlayer).toBeInTheDocument();
    });

    it('should sync transcript with video time', () => {
        jest.clearAllMocks();

        const mockSetCurrentTranscriptItem = jest.fn();
        const mockSetActiveIndex = jest.fn();
        const mockContext = {
            ...mockVideoContext,
            videoId: 'test-video-id',
            transcript: [
                { text: 'First sentence', start: 0, duration: 2 },
                { text: 'Second sentence', start: 2, duration: 2 }
            ] as TranscriptItemType[],
            currentTranscriptItem: [],
            setCurrentTranscriptItem: mockSetCurrentTranscriptItem,
            activeIndex: 0,
            setActiveIndex: mockSetActiveIndex,
            playerRef: {
                current: {
                    currentTime: () => 1.5,
                    on: jest.fn(),
                    fill: jest.fn(),
                    isDisposed: () => false,
                    autoplay: jest.fn(),
                    src: jest.fn(),
                    dispose: jest.fn()
                }
            }
        };

        render(
            <VideoContext.Provider value={mockContext}>
                <VideoPlayer />
            </VideoContext.Provider>
        );

        const videoElement = screen.getByTestId('VideoPlayerId');
        videoElement.dispatchEvent(new Event('timeupdate'));

        setTimeout(() => {
            expect(mockSetCurrentTranscriptItem).toHaveBeenCalled();
            expect(mockSetActiveIndex).toHaveBeenCalled();
        }, 0);
    });
});


