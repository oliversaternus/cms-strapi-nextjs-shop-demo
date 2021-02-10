import * as React from "react";
import { CardsSection, HeroSection, BannerSection, TextSection, QuoteSection, TextWithImageSection, PageContent, ContactSection, GallerySection, LocationSection } from '../tools/Models';
import dynamic from 'next/dynamic';
const Hero = dynamic(() => import('./sections/Hero'));
const Cards = dynamic(() => import('./sections/Cards'));
const Banner = dynamic(() => import('./sections/Banner'));
const Text = dynamic(() => import('./sections/Text'));
const TextWithImage = dynamic(() => import('./sections/TextWithImage'));
const Quote = dynamic(() => import('./sections/Quote'));
const Contact = dynamic(() => import('./sections/Contact'));
const Gallery = dynamic(() => import('./sections/Gallery'));
const Location = dynamic(() => import('./sections/Location'));

interface GenericContentProps {
    content?: PageContent[];
    style?: React.CSSProperties;
    className?: string;
}

const GenericContent: React.FC<GenericContentProps> = (props) => {
    const { className, style, content } = props;
    return (
        <div className={className} style={style}>
            {content?.map((item: any) => {
                switch (item.__component) {
                    case 'section.hero':
                        return <Hero key={`hero-${item.id}`} hero={(item as HeroSection)} />
                    case 'section.cards':
                        return <Cards key={`cards-${item.id}`} cards={(item as CardsSection)} />
                    case 'section.banner':
                        return <Banner key={`banner-${item.id}`} banner={(item as BannerSection)} />
                    case 'section.text':
                        return <Text key={`text-${item.id}`} text={(item as TextSection)} />
                    case 'section.text-with-image':
                        return <TextWithImage key={`text-with-image-${item.id}`} text={(item as TextWithImageSection)} />
                    case 'section.quote':
                        return <Quote key={`quote-${item.id}`} quote={(item as QuoteSection)} />
                    case 'section.contact':
                        return <Contact key={`contact-${item.id}`} contact={(item as ContactSection)} />
                    case 'section.gallery':
                        return <Gallery key={`gallery-${item.id}`} gallery={(item as GallerySection)} />
                    case 'section.location':
                        return <Location key={`location-${item.id}`} location={(item as LocationSection)} />
                }
                return null;
            })}
        </div>
    );
};

export default GenericContent;