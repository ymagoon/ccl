<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions" 
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n cdocfx">

    <!-- Required to include CommonFxn.xslt -->
    <!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt"/>
    <!-- Uncomment this line to debug  <xsl:import href="commonfxn.xslt"/> -->

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Including Strings to be used -->
    <xsl:variable name="OngoingProblems" as="xs:string">
        <xsl:value-of select="'Ongoing'"/>
    </xsl:variable>
    
    <xsl:variable name="HistoricalProblems" as="xs:string">
        <xsl:value-of select="'Historical'"/>
    </xsl:variable>
    
    <xsl:variable name="NoQualifyingData" as="xs:string">
        <xsl:value-of select="'No qualifying data'"/>
    </xsl:variable>
    
    <xsl:variable name="NoChronicProblems" as="xs:string">
        <xsl:value-of select="'No chronic problems'"/>
    </xsl:variable>

    <!-- Problem nodes with nomenclature concept cki as 'CERNER!NKP' and life-cycle-status-code as 'ACTIVE' -->
    <xsl:variable name="NKPNodes">
        <xsl:for-each select="n:report/n:clinical-data/n:problem-data/n:problem">
            <xsl:if test="(cdocfx:getCodeMeanByID(@life-cycle-status-code)='ACTIVE') and (cdocfx:getNomenclatureConceptCKIByID(n:problem-name) = 'CERNER!NKP')">
                <xsl:copy-of select="."/>
            </xsl:if>
        </xsl:for-each>
    </xsl:variable>
    
    <!-- Problem nodes with a classification_cd attribute and life-cycle-status-code as 'ACTIVE' or 'INACTIVE'-->
    <xsl:variable name="OngoingProblemNodes">
        <xsl:for-each select="n:report/n:clinical-data/n:problem-data/n:problem">
            <xsl:if test="@classification-code and ((cdocfx:getCodeMeanByID(@life-cycle-status-code)='ACTIVE') or (cdocfx:getCodeMeanByID(@life-cycle-status-code)='INACTIVE'))">
                <xsl:copy-of select="."/>
            </xsl:if>
        </xsl:for-each>
    </xsl:variable>
    
    <!-- Problem nodes with a classification_cd attribute and life-cycle-status-code as 'RESOLVED'-->
    <xsl:variable name="HistoricalProblemNodes">
        <xsl:for-each select="n:report/n:clinical-data/n:problem-data/n:problem">
            <xsl:if test="@classification-code and (cdocfx:getCodeMeanByID(@life-cycle-status-code)='RESOLVED')">
                <xsl:copy-of select="."/>
            </xsl:if>
        </xsl:for-each>
    </xsl:variable>
    
    <!-- cdocfx:displayOngoing -->
    <xsl:template name="cdocfx:displayOngoing">
        <xsl:param name="NKPNodes"/>
        <xsl:param name="OngoingProblemNodes"/>
        <xsl:choose>
            <xsl:when test="count($NKPNodes/n:problem) = 0 and count($OngoingProblemNodes/n:problem) &gt; 0">
                <xsl:for-each select="$OngoingProblemNodes/n:problem">
                    <xsl:sort select="fn:upper-case(cdocfx:get-clinical-display(@annotated-display, n:problem-name))"/>
                    <div class="ddemrcontentitem ddremovable" style="margin-left: 1em;">
                        <xsl:attribute name="dd:entityid">
                            <xsl:value-of select="@id"/>
                        </xsl:attribute>
                        <xsl:attribute name="dd:contenttype">
                            <xsl:text>PROBLEMS</xsl:text>
                        </xsl:attribute>
                        
                        <xsl:value-of select="cdocfx:get-clinical-display(@annotated-display, n:problem-name)"/>
                    </div>
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:choose>
                    <xsl:when test="count($NKPNodes/n:problem) &gt; 0">
                        <div class="ddemrcontentitem" style="margin-left: 1em; padding-left: 1em; text-indent: -1em;">
                            
                            <!-- Id of the NKP problem -->
                            <xsl:variable name="NKPProblemId">
                                <xsl:choose>
                                    <xsl:when test="$NKPNodes[1]/@id">
                                        <xsl:value-of select="$NKPNodes[1]/@id"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="''"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:variable>
                            
                            <xsl:attribute name="dd:entityid">
                                <xsl:value-of select="$NKPProblemId"/>
                            </xsl:attribute>
                            <xsl:attribute name="dd:contenttype">
                                <xsl:text>PROBLEMS</xsl:text>
                            </xsl:attribute>
                            <xsl:value-of select="$NoChronicProblems"/>
                        </div>
                    </xsl:when>
                    <xsl:otherwise>
                        <div style="margin-left: 1em; padding-left: 1em; text-indent: -1em;">
                            <xsl:value-of select="$NoQualifyingData"/>
                        </div>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!-- cdocfx:displayHistorical -->
    <xsl:template name="cdocfx:displayHistorical">
        <xsl:param name="HistoricalProblemNodes"/>
        <xsl:choose>
            <xsl:when test="count($HistoricalProblemNodes/n:problem) &gt; 0">
                <xsl:for-each select="$HistoricalProblemNodes/n:problem">
                    <xsl:sort select="fn:upper-case(cdocfx:get-clinical-display(@annotated-display, n:problem-name))"/>
                    <div class="ddemrcontentitem ddremovable"
                        style="margin-left: 1em; padding-left: 1em; text-indent: -1em;">
                        <xsl:attribute name="dd:entityid">
                            <xsl:value-of select="@id"/>
                        </xsl:attribute>
                        <xsl:attribute name="dd:contenttype">
                            <xsl:text>PROBLEMS</xsl:text>
                        </xsl:attribute>
                        <xsl:value-of select="cdocfx:get-clinical-display(@annotated-display, n:problem-name)"/>
                    </div>
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <div style="margin-left: 1em; padding-left: 1em; text-indent: -1em;">
                    <xsl:value-of select="$NoQualifyingData"/>
                </div>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Get display of the given problem. Use problem-name/freetext when available, otherwise use annotated display or nomenclature description -->
    <!-- Parameters: -->
    <!-- problem - problem object -->
    <xsl:function name="cdocfx:getProblemDisplay">
        <xsl:param name="Problem"/>

        <xsl:if test="$Problem/n:problem-name/n:freetext or $Problem/@annotated-display">
            <xsl:choose>
                <xsl:when test="$Problem/n:problem-name/n:freetext">
                    <xsl:value-of select="$Problem/n:problem-name/n:freetext"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:choose>
                        <xsl:when test="$Problem/@annotated-display">
                            <xsl:value-of select="$Problem/@annotated-display"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="cdocfx:getNomenclatureDescByID($Problem/n:problem-name/n:nomenclature)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
    </xsl:function>

</xsl:stylesheet>
