import React, { forwardRef } from "react"

const GenerateTile = forwardRef(({ i, tiles, startDrawing, userSelectedTile }) => (
    <td className="bg-white border border-slate-200 p-0 ">
        <div className="w-[100px] h-[100px] flex items-center" onClick={() => startDrawing(i)}>
            {tiles[i] ? (
                <picture>
                    <img alt={`Artboard tile ${i}`} id={`${i}`} src={tiles[i] ? tiles[i] : ""} />
                </picture>
            ) : userSelectedTile ? (
                <p className="text-sm text-brand-blue w-full text-center text-opacity-30">open tile</p>
            ) : (
                <p className="text-sm text-brand-blue w-full text-center">open tile</p>
            )}
        </div>
    </td>
))

export default GenerateTile

GenerateTile.displayName = "GenerateTile"
