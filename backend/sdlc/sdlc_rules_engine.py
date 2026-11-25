

def yes(value):
    return value is True


def no(value):
    return value is False


def unknown(value):
    return value is None


def evaluate_model(name, core, supporting, conflicts, unknowns):

    core_yes = sum(yes(v) for v in core.values())
    core_no = sum(no(v) for v in core.values())
    core_unknown = sum(unknown(v) for v in core.values())

    supporting_yes = sum(yes(v) for v in supporting.values())

    print(f"\n{name}")
    print("-" * len(name))

   
    print(
        f"Core conditions: "
        f"{core_yes} YES / {core_no} NO / {core_unknown} UNKNOWN"
    )

    for condition, result in core.items():

        if result is True:
            print("  ✓ YES:", condition)

        elif result is False:
            print("  ✗ NO:", condition)

        else:
            print("  ? UNKNOWN:", condition)

   
    print(f"\nSupporting conditions: {supporting_yes} YES")

    for condition, result in supporting.items():

        if result is True:
            print("  + YES:", condition)

        elif result is False:
            print("  - NO:", condition)

        else:
            print("  ? UNKNOWN:", condition)

    
    print(f"\nContradictions: {len(conflicts)}")

    for item in conflicts:
        print("  -", item)

   
    print(f"\nUnknown conditions: {len(unknowns)}")

    for item in unknowns:
        print("  ? ", item)

    
    if len(conflicts) > 0:
        status = "WEAK"

    elif core_no > 0:
        status = "WEAK"

    elif core_unknown > 0:
        status = "CONDITIONAL - INFORMATION REQUIRED"

    elif core_yes == len(core):
        status = "STRONG CANDIDATE"

    else:
        status = "INSUFFICIENT EVIDENCE"

    print("\nSTATUS:", status)




project = {

    "requirement_stability": "Moderate to High",
    "requirement_uncertainty": "Low",
    "requirement_change": "Unknown",

    "functional_complexity": "Low to Moderate",
    "project_complexity": "Low to Moderate",
    "risk": "Low to Moderate",

    "user_involvement": "Moderate",

    "need_prototype": "Unknown",
    "formal_vv": "Unknown",

    "short_timeline": "Unknown",
    "modular_system": "Unknown",
    "early_working_system": "Unknown",
    "frequent_releases": "Unknown"
}


print("\n========== NITK SDLC RULE CHECK ==========\n")




waterfall_core = {

    "Requirements are stable":
        True if project["requirement_stability"]
        in ["Stable", "High", "Moderate to High"]
        else None if project["requirement_stability"] == "Unknown"
        else False,

    "Requirement uncertainty is low":
        True if project["requirement_uncertainty"] == "Low"
        else None if project["requirement_uncertainty"] == "Unknown"
        else False,

    "Project is well understood":
        True if project["project_complexity"]
        in ["Low", "Low to Moderate"]
        else None if project["project_complexity"] == "Unknown"
        else False
}


waterfall_supporting = {

    "Functionality is relatively simple":
        True if project["functional_complexity"]
        in ["Low", "Low to Moderate"]
        else None if project["functional_complexity"] == "Unknown"
        else False
}


waterfall_conflicts = []

if project["requirement_change"] == "High":
    waterfall_conflicts.append(
        "Requirements change frequently"
    )


waterfall_unknowns = []

if project["requirement_change"] == "Unknown":
    waterfall_unknowns.append(
        "Requirement change frequency"
    )


evaluate_model(
    "Waterfall",
    waterfall_core,
    waterfall_supporting,
    waterfall_conflicts,
    waterfall_unknowns
)




v_core = {

    "Requirements are well defined":
        True if project["requirement_uncertainty"] == "Low"
        else None if project["requirement_uncertainty"] == "Unknown"
        else False,

    "Requirements are stable":
        True if project["requirement_stability"]
        in ["Stable", "High", "Moderate to High"]
        else None if project["requirement_stability"] == "Unknown"
        else False,

    "Strong verification and validation required":
        True if project["formal_vv"] == "High"
        else None if project["formal_vv"] == "Unknown"
        else False
}


v_supporting = {}


v_conflicts = []

if project["requirement_change"] == "High":
    v_conflicts.append(
        "Requirements change frequently"
    )


v_unknowns = []

if project["formal_vv"] == "Unknown":
    v_unknowns.append(
        "Need for strong verification and validation"
    )


evaluate_model(
    "V-Shaped",
    v_core,
    v_supporting,
    v_conflicts,
    v_unknowns
)




prototype_core = {

    "Requirements need clarification":
        True if project["requirement_uncertainty"]
        in ["Medium", "High"]
        else None if project["requirement_uncertainty"] == "Unknown"
        else False,

    "Prototype is needed":
        True if project["need_prototype"] == "Yes"
        else None if project["need_prototype"] == "Unknown"
        else False
}


prototype_supporting = {

    "High user involvement":
        True if project["user_involvement"]
        in ["High", "Very High"]
        else None if project["user_involvement"] == "Unknown"
        else False
}


prototype_conflicts = []

if project["requirement_uncertainty"] == "Low":
    prototype_conflicts.append(
        "Requirements are already well understood"
    )


prototype_unknowns = []

if project["need_prototype"] == "Unknown":
    prototype_unknowns.append(
        "Whether a prototype is required"
    )


evaluate_model(
    "Prototype",
    prototype_core,
    prototype_supporting,
    prototype_conflicts,
    prototype_unknowns
)




rad_core = {

    "Requirements can change":
        True if project["requirement_change"] == "High"
        else None if project["requirement_change"] == "Unknown"
        else False,

    "High user involvement":
        True if project["user_involvement"]
        in ["High", "Very High"]
        else None if project["user_involvement"] == "Unknown"
        else False,

    "Short 2-3 month timeframe":
        True if project["short_timeline"] == "Yes"
        else None if project["short_timeline"] == "Unknown"
        else False,

    "System is modularizable":
        True if project["modular_system"] == "Yes"
        else None if project["modular_system"] == "Unknown"
        else False
}


rad_supporting = {}


rad_conflicts = []


rad_unknowns = []

if project["requirement_change"] == "Unknown":
    rad_unknowns.append(
        "Requirement change frequency"
    )

if project["short_timeline"] == "Unknown":
    rad_unknowns.append(
        "Project duration"
    )

if project["modular_system"] == "Unknown":
    rad_unknowns.append(
        "Whether system can be modularized"
    )

if project["user_involvement"] == "Unknown":
    rad_unknowns.append(
        "User involvement level"
    )


evaluate_model(
    "RAD",
    rad_core,
    rad_supporting,
    rad_conflicts,
    rad_unknowns
)




iterative_core = {

    "Major requirements are known":
        True if project["requirement_uncertainty"] == "Low"
        else None if project["requirement_uncertainty"] == "Unknown"
        else False,

    "Details may evolve":
        True if project["requirement_change"] == "High"
        else None if project["requirement_change"] == "Unknown"
        else False,

    "Early working functionality is needed":
        True if project["early_working_system"] == "Yes"
        else None if project["early_working_system"] == "Unknown"
        else False
}


iterative_supporting = {

    "Risk analysis is important":
        True if project["risk"] in ["Medium", "High"]
        else None if project["risk"] == "Unknown"
        else False
}


iterative_conflicts = []

if project["requirement_change"] == "Low":
    iterative_conflicts.append(
        "Requirements are stable with little expected change"
    )


iterative_unknowns = []

if project["requirement_change"] == "Unknown":
    iterative_unknowns.append(
        "Whether requirements/details will evolve"
    )

if project["early_working_system"] == "Unknown":
    iterative_unknowns.append(
        "Need for early working functionality"
    )


evaluate_model(
    "Iterative / Incremental",
    iterative_core,
    iterative_supporting,
    iterative_conflicts,
    iterative_unknowns
)



spiral_core = {

    "Risk evaluation is important":
        True if project["risk"] in ["Medium", "High"]
        else None if project["risk"] == "Unknown"
        else False,

    "Requirements are uncertain or complex":
        True if project["requirement_uncertainty"]
        in ["Medium", "High"]
        else None if project["requirement_uncertainty"] == "Unknown"
        else False,

    "Project is complex":
        True if project["project_complexity"]
        in ["High", "Very High"]
        else None if project["project_complexity"] == "Unknown"
        else False
}


spiral_supporting = {

    "Significant requirement changes expected":
        True if project["requirement_change"] == "High"
        else None if project["requirement_change"] == "Unknown"
        else False
}


spiral_conflicts = []

if project["risk"] == "Low":
    spiral_conflicts.append(
        "Project risk is low"
    )


spiral_unknowns = []

if project["risk"] == "Unknown":
    spiral_unknowns.append(
        "Project risk level"
    )


evaluate_model(
    "Spiral",
    spiral_core,
    spiral_supporting,
    spiral_conflicts,
    spiral_unknowns
)




agile_core = {

    "Requirements change frequently":
        True if project["requirement_change"] == "High"
        else None if project["requirement_change"] == "Unknown"
        else False,

    "High / continuous user involvement":
        True if project["user_involvement"]
        in ["High", "Very High"]
        else None if project["user_involvement"] == "Unknown"
        else False,

    "Frequent releases are required":
        True if project["frequent_releases"] == "Yes"
        else None if project["frequent_releases"] == "Unknown"
        else False
}


agile_supporting = {}


agile_conflicts = []

if project["requirement_change"] == "Low":
    agile_conflicts.append(
        "Requirements are stable"
    )


agile_unknowns = []

if project["requirement_change"] == "Unknown":
    agile_unknowns.append(
        "Requirement change frequency"
    )

if project["frequent_releases"] == "Unknown":
    agile_unknowns.append(
        "Need for frequent releases"
    )


evaluate_model(
    "Agile",
    agile_core,
    agile_supporting,
    agile_conflicts,
    agile_unknowns
)