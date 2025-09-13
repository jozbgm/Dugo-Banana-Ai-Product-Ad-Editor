import React from 'react';
import { AspectRatio, CameraPerspective, LightTemperature, ShadowIntensity, Option, ShotType } from '../types';
import { AspectRatioOptions, CameraPerspectiveOptions, LightTemperatureOptions, ShadowIntensityOptions, ShotTypeOptions } from '../constants';
import { Tooltip } from './Tooltip';

interface ControlPanelProps {
    aspectRatio: AspectRatio;
    setAspectRatio: (value: AspectRatio) => void;
    lightTemperature: LightTemperature;
    setLightTemperature: (value: LightTemperature) => void;
    shadowIntensity: ShadowIntensity;
    setShadowIntensity: (value: ShadowIntensity) => void;
    cameraPerspective: CameraPerspective;
    setCameraPerspective: (value: CameraPerspective) => void;
    shotType: ShotType;
    setShotType: (value: ShotType) => void;
    t: (key: string) => string;
}

const SelectControl = <T extends string>({ label, value, onChange, options, tooltip, t }: { label: string, value: T, onChange: (v: T) => void, options: ReadonlyArray<Option<T>>, tooltip: string, t: (key: string) => string }) => (
    <div className="flex flex-col gap-1.5">
        <Tooltip text={tooltip}>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-help">{label}</label>
        </Tooltip>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
            ))}
        </select>
    </div>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({
    aspectRatio, setAspectRatio,
    lightTemperature, setLightTemperature,
    shadowIntensity, setShadowIntensity,
    cameraPerspective, setCameraPerspective,
    shotType, setShotType,
    t
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectControl
                label={t('controls.aspectRatio')}
                value={aspectRatio}
                onChange={setAspectRatio}
                options={AspectRatioOptions}
                tooltip={t('tooltips.aspectRatio')}
                t={t}
            />
             <SelectControl
                label={t('controls.cameraPerspective')}
                value={cameraPerspective}
                onChange={setCameraPerspective}
                options={CameraPerspectiveOptions}
                tooltip={t('tooltips.cameraPerspective')}
                t={t}
            />
            <SelectControl
                label={t('controls.shotType')}
                value={shotType}
                onChange={setShotType}
                options={ShotTypeOptions}
                tooltip={t('tooltips.shotType')}
                t={t}
            />
            <SelectControl
                label={t('controls.lightTemperature')}
                value={lightTemperature}
                onChange={setLightTemperature}
                options={LightTemperatureOptions}
                tooltip={t('tooltips.lightTemperature')}
                t={t}
            />
             <SelectControl
                label={t('controls.shadowIntensity')}
                value={shadowIntensity}
                onChange={setShadowIntensity}
                options={ShadowIntensityOptions}
                tooltip={t('tooltips.shadowIntensity')}
                t={t}
            />
        </div>
    );
};