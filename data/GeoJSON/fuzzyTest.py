from fuzzywuzzy import fuzz

def test_fuzzywuzzy():
    print(fuzz.ratio("Royal Instituteo of Technology", "Kth Royal Institute of Technology"))
    print(fuzz.ratio("Adler University", "Yale University"))
    print(fuzz.ratio("University of California (Los Angeles)", "University of California"))
    print(fuzz.ratio("University", "Yale University"))
    print(fuzz.ratio("Massachusetts Institute Of Technology (Mit)", "Massachusetts Institute Of Technology"))

test_fuzzywuzzy()