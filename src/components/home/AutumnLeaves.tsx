import { Leaf, randomLeafField } from "@/components/ui/Leaf";

// Starts below the nav bar's height so leaves never drift through the logo —
// the nav is transparent over the hero and would show them right on top of it.
export default function AutumnLeaves() {
  const leaves = randomLeafField(9);
  return (
    <div className="absolute top-16 inset-x-0 bottom-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <div
          key={i}
          className="leaf-drift absolute top-0"
          style={{
            left: leaf.left,
            width: leaf.size,
            height: leaf.size,
            animationName: "leafDrift",
            animationDuration: leaf.duration,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: leaf.delay,
            ["--drift-x0" as string]: leaf.driftX0,
            ["--drift-xm" as string]: leaf.driftXm,
            ["--drift-x1" as string]: leaf.driftX1,
            ["--drift-rot" as string]: leaf.driftRot,
          }}
        >
          <Leaf color={leaf.color} rotate={leaf.rotate} shape={leaf.shape} />
        </div>
      ))}
    </div>
  );
}
