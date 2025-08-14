import React from 'react';
import { 
  CuteButton, 
  PrimaryButton, 
  SecondaryButton, 
  ActionButton,
  CuteCard,
  InteractiveCard,
  ContentCard,
  ElevatedCard
} from './index';
import { Heart, Plus, Share2 } from 'lucide-react';

// Test component to verify the new design system works
export function TestComponents() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">CuteButton Tests</h2>
        <div className="flex flex-wrap gap-4">
          <CuteButton cuteVariant="primary" cuteSize="sm">
            Small Primary
          </CuteButton>
          <CuteButton cuteVariant="secondary" cuteSize="md">
            Medium Secondary
          </CuteButton>
          <CuteButton cuteVariant="outline" cuteSize="lg">
            Large Outline
          </CuteButton>
          <CuteButton cuteVariant="ghost" isIcon cuteSize="md">
            <Heart className="w-4 h-4" />
          </CuteButton>
          <PrimaryButton cuteSize="xl">
            <Plus className="w-5 h-5" />
            XL Primary
          </PrimaryButton>
          <SecondaryButton>
            Secondary Helper
          </SecondaryButton>
          <ActionButton>
            <Share2 className="w-5 h-5" />
            Action Button
          </ActionButton>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">CuteCard Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CuteCard cuteSize="sm" cuteBorder="primary">
            <div className="p-4">
              <h3 className="font-semibold">Small Primary Border</h3>
              <p>This is a small card with primary border.</p>
            </div>
          </CuteCard>

          <InteractiveCard 
            cuteSize="md" 
            onClick={() => alert('Interactive card clicked!')}
          >
            <div className="p-6">
              <h3 className="font-semibold">Interactive Card</h3>
              <p>Click me! I have hover and keyboard support.</p>
            </div>
          </InteractiveCard>

          <ElevatedCard cuteSize="lg">
            <div className="p-8">
              <h3 className="font-semibold">Elevated Large</h3>
              <p>This card has enhanced shadow and larger padding.</p>
            </div>
          </ElevatedCard>

          <ContentCard 
            title="Content Card"
            cuteBorder="success"
            footer={
              <div className="flex gap-2">
                <PrimaryButton cuteSize="sm">Action</PrimaryButton>
                <SecondaryButton cuteSize="sm">Cancel</SecondaryButton>
              </div>
            }
          >
            <p>This card has automatic title and footer spacing with success border.</p>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}