<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>

<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    exclude-result-prefixes="xsl xs fn cdocfx n dd xr-date-formatter">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/goalscommon.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="goalscommon.xslt" />-->

    <xsl:variable name="barrierLabel" as="xs:string" select="'Barriers: '"/>
    <xsl:variable name="interventionLabel" as="xs:string" select="'Interventions: '"/>
    <xsl:variable name="outcomeLabel" as="xs:string" select="'Outcome: '"/>

    <xsl:template match="/">
        <ul style="list-style-type: disc; margin: 0; padding-left: 1em;">
            <xsl:call-template name="emitGoals"/>
        </ul>
    </xsl:template>

    <!-- Called from emitGoals in GoalsCommon.xslt, assume a goal element in context -->
    <xsl:template name="displayGoal">
        <li class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
            <xsl:if test="@id">
                <xsl:attribute name="dd:entityid">
                    <xsl:value-of select="@id"/>
                </xsl:attribute>
            </xsl:if>
             <xsl:attribute name="dd:contenttype">
                <xsl:text>GOALS</xsl:text>
            </xsl:attribute>
            <!-- If status-nomenclature-id exists, append the nomenclature description to the end of the
            goal description -->
                <xsl:value-of select="@description"/>
            <xsl:if test="@status-nomenclature-id">
                <!-- Since status-nomenclature-id is optional in the report, we check to verify it exists
                before passing to function to avoid throwing an exception. -->
                 <xsl:value-of select="concat(' - ', cdocfx:getNomenclatureDescByID(@status-nomenclature-id))"/>
            </xsl:if>
            <xsl:call-template name="displayBarriers"/>
            <xsl:call-template name="displayInterventions"/>
            <xsl:call-template name="displayOutcome"/>
        </li>
 </xsl:template>

    <!-- Outputs the interventions associated with a goal if any exist. Outputs nothing if no
    interventions exist. -->
    <xsl:template name="displayInterventions">

        <xsl:choose>

            <xsl:when test="n:intervention">
                <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right" style="padding-left:1em; overflow: hidden;">
                    <div style="float: left;">

                        <xsl:value-of select="$interventionLabel"></xsl:value-of>
                    </div>
                    <div style="float: left; padding-left:1em; text-indent:-1em;">

                        <xsl:for-each select="n:intervention">

                            <xsl:sort select="@description" order="ascending"/>
                            <div>
                                <!-- When status-nomenclature-id exists, output the status of the intervention
                                immediately following the intervention description. When status-nomenclature-id does
                                not exist, output the intervention description only.-->

                                <xsl:value-of select="@description"/>

                                <xsl:if test="@status-nomenclature-id">

                                    <xsl:value-of select="concat(' - ', cdocfx:getNomenclatureDescByID(@status-nomenclature-id))"></xsl:value-of>
                                </xsl:if>
                            </div>
                        </xsl:for-each>
                    </div>
                </div>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- Outputs the barriers associated with a goal if any exist. Outputs nothing if no barriers exist. -->
    <xsl:template name="displayBarriers">
        <!-- Verify barriers exist -->

        <xsl:if test="n:barrier-nomenclature-id">
            <span class="ddgrouper ddremovable">

                <xsl:value-of select="concat(' (', $barrierLabel)"/>

                <xsl:for-each select="n:barrier-nomenclature-id">

                    <xsl:choose>

                        <xsl:when test="position() != last()"> <!-- If this is not the last item, display a comma-space after the barrier name -->

                            <xsl:value-of select="concat(cdocfx:getNomenclatureDescByID(text()), ', ')"/>
                        </xsl:when>

                        <xsl:otherwise> <!-- If this is the last item, display the barrier name followed by a closing parentheses -->

                            <xsl:value-of select="concat(cdocfx:getNomenclatureDescByID(text()), ')')"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:for-each>
            </span>
        </xsl:if>
    </xsl:template>

    <!-- Outputs the outcome/comment associated with a goal if it exists. Outputs nothing if no
    comment exists. -->
    <xsl:template name="displayOutcome">
        <xsl:choose>
            <xsl:when test="n:comment/n:comment != ''">
                <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right" style="padding-left:1em; overflow: hidden;">
                    <div style="float: left;">
                        <xsl:value-of select="$outcomeLabel"/>
                    </div>
                    <div style="float: left; padding-left:1em; text-indent:-1em;">
                        <xsl:value-of select="n:comment/n:comment/text()"/>
                    </div>
                </div>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>
